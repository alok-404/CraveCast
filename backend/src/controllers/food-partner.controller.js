const foodPartnerModel = require('../models/foodpartner.model');
const foodModel = require('../models/food.model');
const reviewModel = require('../models/review.model'); 
const mongoose = require("mongoose");

// --- 1. Controller for Home Page List (GET /api/food-partner/) ---
async function getFoodPartners(req, res) {
    try {
        const partners = await foodPartnerModel.find({})
            .select("businessName cuisine averageRating address coverImage")
            .sort({ averageRating: -1, createdAt: -1 })
            .limit(20); 

        if (!partners || partners.length === 0) {
            return res.status(404).json({ message: "No restaurants found." });
        }

        res.status(200).json({
            message: "List of food partners retrieved successfully for home screen.",
            partners: partners
        });

    } catch (err) {
        console.error("Error in getFoodPartners:", err);
        return res.status(500).json({ message: "Server error fetching partner list." });
    }
}

// --- 2. Controller for Single Partner Details (GET /api/food-partner/:id) ---
async function getFoodPartnerById(req, res) {
    const foodPartnerId = req.params.id ? req.params.id.trim() : null; 

    try {
        if (!foodPartnerId || !mongoose.Types.ObjectId.isValid(foodPartnerId)) {
            return res.status(400).json({ message: "Invalid Food Partner ID provided." });
        }

        // Fetch Partner Details and POPULATE Reviews
        const foodPartner = await foodPartnerModel.findById(foodPartnerId)
            .select('-password -__v') 
            .populate({
                path: 'reviews', 
                select: 'user rating comment createdAt',
                populate: {
                    path: 'user',
                    select: 'username fullName profilePic video description likes saves comments' 
                }
            });

        if (!foodPartner) {
            return res.status(404).json({ message: "Food partner not found." });
        }
        
        // Fetch related Food Items (Reel Videos) separately
        const foodItemsByFoodPartner = await foodModel.find({ foodPartner: foodPartnerId })
            // CRITICAL: Selecting new array fields for likes/saves/comments
            .select('name video description likes saves comments') 
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Food partner details and reels retrieved successfully.",
            foodPartner: {
                ...foodPartner.toObject(),
                foodItems: foodItemsByFoodPartner 
            }
        });

    } catch (err) {
        console.error("Error in getFoodPartnerById:", err);
        return res.status(500).json({ message: "Server error fetching partner data." });
    }
}

module.exports = {
    getFoodPartnerById,
    getFoodPartners
};