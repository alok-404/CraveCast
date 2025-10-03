const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user", // किस user ने review दिया है
        required: true
    },
    foodPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "foodpartner", // किस Restaurant को review दिया है
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5, // 1 से 5 स्टार रेटिंग
        required: true
    },
    comment: {
        type: String,
        trim: true,
        required: true
    }
}, {
    timestamps: true
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;