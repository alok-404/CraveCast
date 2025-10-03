const foodModel = require("../models/food.model");
const likeModel = require("../models/likes.model"); // Assuming the model is named likes.model
const commentModel = require("../models/comment.model");
const foodPartnerModel = require("../models/foodpartner.model"); 
const saveModel = require("../models/save.model");
const dishModel = require("../models/dish.model");
const { uploadFile } = require("../services/storage.service");
const { v4: uuid } = require("uuid");
const mongoose = require("mongoose");
const { authUserMiddleware } = require("../middlewares/auth.middleware");
// --- 1. Create Food (Reel) ---
async function createFood(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Video file is required" });
    } // Upload to storage service (e.g., ImageKit)

    const fileUploadResult = await uploadFile(req.file, uuid()); // Save food item

    const foodItem = await foodModel.create({
      name: req.body.name,
      description: req.body.description,
      video: fileUploadResult.url,
      foodPartner: req.foodPartner._id, // Assuming auth middleware provides foodPartner
    });

    res.status(201).json({
      message: "Food created successfully",
      food: foodItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
}

// --- 2. Get All Food Items (Reels) ---
async function getFoodItems(req, res) {
  try {
    // Fetch food items and populate partner details for display
    const foodItems = await foodModel
      .find({})
      .populate("foodPartner", "businessName") // Populate restaurant name
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Food Items Fetched Successfully",
      foodItems,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
}

// --- 3. Like/Unlike Food Reel (Updated for Array Schema) ---
async function likeFood(req, res) {
  // Assuming foodId comes from URL params: req.params.foodId
  const foodId = req.params.foodId;
  const user = req.user;

  try {
    const food = await foodModel.findById(foodId);
    if (!food) return res.status(404).json({ message: "Food reel not found." });

    const existingLike = await likeModel.findOne({
      user: user._id,
      food: foodId,
    });

    if (existingLike) {
      // UNLIKE
      await likeModel.deleteOne({ user: user._id, food: foodId }); // Remove the like ID from the food's 'likes' array
      food.likes.pull(existingLike._id);
      await food.save();

      return res
        .status(200)
        .json({ message: "Food unliked successfully", isLiked: false });
    } // LIKE

    const like = await likeModel.create({ user: user._id, food: foodId }); // Add the new like ID to the food's 'likes' array
    food.likes.push(like._id);
    await food.save();

    return res
      .status(201)
      .json({ message: "Food liked successfully", like, isLiked: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
}

// --- 4. Save/Unsave Food Reel (Updated for Array Schema) ---
async function saveFood(req, res) {
  // Assuming foodId comes from URL params: req.params.foodId
  const foodId = req.params.foodId;
  const user = req.user;

  try {
    const food = await foodModel.findById(foodId);
    if (!food) return res.status(404).json({ message: "Food reel not found." });

    const isAlreadySaved = await saveModel.findOne({
      user: user._id,
      food: foodId,
    });

    if (isAlreadySaved) {
      // UNSAVE
      await saveModel.deleteOne({ user: user._id, food: foodId }); // Remove the save ID from the food's 'saves' array
      food.saves.pull(isAlreadySaved._id);
      await food.save();
      return res
        .status(200)
        .json({ message: "Food unsaved successfully", isSaved: false });
    } // SAVE

    const save = await saveModel.create({ user: user._id, food: foodId }); // Add the new save ID to the food's 'saves' array
    food.saves.push(save._id);
    await food.save();
    return res
      .status(201)
      .json({ message: "Food saved successfully", save, isSaved: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
}


async function getSavedReels(req, res) {
  try {
    const saves = await saveModel
      .find({ user: req.user._id })
      .populate({
        path: "food",
        populate: { path: "foodPartner", select: "businessName" }, // populate partner name
      })
      .sort({ createdAt: -1 });

    const savedReels = saves.map((s) => s.food); // extract food objects

    res.status(200).json({ savedReels });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch saved reels" });
  }
}

module.exports = {
  getSavedReels,
};

// --- 5. Add Comment (Updated for Array Schema) ---
async function addComment(req, res) {
  try {
    const { text } = req.body;
    const { foodId } = req.params;
    const user = req.user;

    if (!text || !foodId) {
      return res
        .status(400)
        .json({ message: "Food ID and comment text required" });
    }

    const food = await foodModel.findById(foodId);
    if (!food) return res.status(404).json({ message: "Food reel not found." });
    const comment = await commentModel.create({
      user: user._id,
      food: foodId,
      text,
    }); // Add comment ID to the food's 'comments' array

    food.comments.push(comment._id);
    await food.save(); // Populate the user details on the new comment before sending it back

    await comment.populate("user", "fullName profilePic");

    res.status(201).json({
      message: "Comment added successfully",
      comment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
}

// --- 6. Get Comments for a Reel ---
async function getComments(req, res) {
  try {
    const { foodId } = req.params; // Find all comments for this food item, populate user, and sort

    const comments = await commentModel
      .find({ food: foodId })
      .populate("user", "fullName email profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Comments fetched successfully",
      comments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
}

// --- 7. Delete Comment (Updated for Array Schema) ---
async function deleteComment(req, res) {
  try {
    const { commentId } = req.params;
    const user = req.user;

    const comment = await commentModel.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    } // Check authorization (user is owner or admin)

    if (comment.user.toString() !== user._id.toString() && !user.isAdmin) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this comment" });
    } // Delete the comment from the comment collection

    await commentModel.findByIdAndDelete(commentId); // Remove the comment ID from the food's 'comments' array
    await foodModel.findByIdAndUpdate(
      comment.food,
      { $pull: { comments: commentId } }, // $pull operator removes the ID
      { new: true }
    );

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
}

// --- 8. Get Food Status (Updated to use Array Length for Counts) ---
async function getFoodStatus(req, res) {
  try {
    const { foodId } = req.params;
    const user = req.user; // Fetch the food reel and its array IDs

    const food = await foodModel.findById(foodId);
    if (!food) return res.status(404).json({ message: "Food not found" });

    const likedByUser = await likeModel.exists({
      user: user._id,
      food: foodId,
    });
    const savedByUser = await saveModel.exists({
      user: user._id,
      food: foodId,
    });

    // Calculate counts based on the size of the arrays
    // NOTE: Using countDocuments is slightly slower but more robust if arrays get very large.
    // For smaller arrays, using food.likes.length is faster if the food object is already fetched.

    res.status(200).json({
      // Use countDocuments for accurate, real-time counts
      likeCount: await likeModel.countDocuments({ food: foodId }),
      saveCount: await saveModel.countDocuments({ food: foodId }),
      commentCount: await commentModel.countDocuments({ food: foodId }),
      likedByUser: !!likedByUser,
      savedByUser: !!savedByUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
}


async function createDish(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    const fileUploadResult = await uploadFile(req.file, uuid());

    const dish = await dishModel.create({
      name: req.body.name,
      description: req.body.description,
      image: fileUploadResult.url,
      foodPartner: req.foodPartner._id,
    });

    res.status(201).json({ message: "Dish created successfully", dish });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
}

async function getDishes(req, res) {
  try {
    const { foodPartner } = req.query;
    const filter = {};

    if (foodPartner && mongoose.Types.ObjectId.isValid(foodPartner)) {
      filter.foodPartner = new mongoose.Types.ObjectId(foodPartner);
    }
console.log("Query filter:", filter);


    const dishes = await dishModel
      .find(filter)
      .populate("foodPartner", "businessName")
      .sort({ createdAt: -1 })
      .lean();
console.log("Found dishes:", dishes);

    res.status(200).json({ message: "Dishes fetched successfully", dishes });
  } catch (error) {
    console.error("Error fetching dishes:", error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}








module.exports = {
  createFood,
  getFoodItems,
  likeFood,
  saveFood,
  addComment,
  getComments,
  deleteComment,
  getFoodStatus,
  createDish,
  getDishes,
  getSavedReels
};
