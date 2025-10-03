const mongoose = require("mongoose");

const foodPartnerSchema = new mongoose.Schema({
    // Restaurant's Public Name
    businessName: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    // Login & Contact Info (Assuming user, email, phone etc. are here)
    email: { type: String, required: true, unique: true, lowercase: true },
    address: { type: String, required: true },
    password: { type: String, required: true },
    
    // --- Public Display Fields ---
    
    // Cuisine Type (Essential for search filters)
    cuisine: {
        type: [String], // Allows multiple cuisines (e.g., ['North Indian', 'Italian'])
        required: true,
        default: []
    },
    
    // Average Rating (Calculated from user reviews)
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    

    // Home page cover image
    coverImage: { type: String, required: true , default: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }, // URL or file path

    // --- Linking Fields ---

    // Array to link to all Reviews given to this partner
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review" // (See Model 2 below)
    }],

    // Array to link to all Food Videos (Reels) created by this partner
    foodVideos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "food" // Your existing foodModel
    }]
}, {
    timestamps: true
});

const foodPartnerModel = mongoose.model("foodpartner", foodPartnerSchema);
module.exports = foodPartnerModel;