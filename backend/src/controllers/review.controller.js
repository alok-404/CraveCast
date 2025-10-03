const ReviewModel = require("../models/review.model");
const FoodPartnerModel = require("../models/foodpartner.model");
const mongoose = require("mongoose");

// Helper function to recalculate the average rating
async function updateAverageRating(foodPartnerId) {
    const allReviews = await ReviewModel.find({ foodPartner: foodPartnerId });

    if (allReviews.length === 0) return 0;
    
    const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
    const newAverage = (totalRating / allReviews.length);

    return newAverage.toFixed(1);
}

// --- 1. Controller to handle submitting a new review (POST /api/reviews/submit) ---
async function submitReview(req, res) {
    const { foodPartnerId, rating, comment } = req.body;
    // CRITICAL FIX: Ensure user data exists
    if (!req.user || !req.user._id) { 
        // This should theoretically be caught by middleware, but serves as a safety check
        return res.status(401).json({ message: "Authentication required to submit a review." });
    }
    const userId = req.user._id; 
    try {
        // Validation
        if (!foodPartnerId || !rating || !comment || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Invalid or missing review data." });
        }

        const existingReview = await ReviewModel.findOne({ user: userId, foodPartner: foodPartnerId });
        if (existingReview) {
            return res.status(400).json({ message: "You have already submitted a review for this restaurant." });
        }

        // Create the new review
        const newReview = await ReviewModel.create({ user: userId, foodPartner: foodPartnerId, rating, comment });

        // Update Partner: Link review and recalculate rating
        const partner = await FoodPartnerModel.findById(foodPartnerId);
        if (!partner) {
            await newReview.deleteOne(); 
            return res.status(404).json({ message: "Restaurant not found." });
        }
        
        partner.reviews.push(newReview._id);
        partner.averageRating = await updateAverageRating(foodPartnerId);

        await partner.save();

        res.status(201).json({ message: "Review submitted successfully.", review: newReview });

    } catch (error) {
        console.error("Error submitting review:", error);
        res.status(500).json({ message: "Failed to submit review due to a server error." });
    }
}

// --- 2. Controller to get all reviews for a specific partner (GET /api/reviews/:partnerId) ---
async function getReviewsByPartner(req, res) {
    const foodPartnerId = req.params.partnerId; 

    try {
        if (!mongoose.Types.ObjectId.isValid(foodPartnerId)) {
            return res.status(400).json({ message: "Invalid Food Partner ID." });
        }

        const reviews = await ReviewModel.find({ foodPartner: foodPartnerId })
            .populate('user', 'username fullName')
            .sort({ createdAt: -1 });

        res.status(200).json({ message: "Reviews retrieved successfully.", reviews: reviews });

    } catch (error) {
        console.error("Error fetching reviews by partner:", error);
        res.status(500).json({ message: "Failed to fetch reviews." });
    }
}


async function deleteReview(req, res) {
  const reviewId = req.params.id;
  const userId = req.user._id;

  try {
    const review = await ReviewModel.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    // Only owner can delete
    if (review.user.toString() !== userId.toString())
      return res.status(403).json({ message: "Not authorized" });

    await review.deleteOne();
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete review" });
  }
}

module.exports = {
  submitReview,
  getReviewsByPartner,
  deleteReview, // <--- export it
};



