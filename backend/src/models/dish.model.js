const mongoose = require("mongoose");

const dishSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String, required: true },
    foodPartner: { type: mongoose.Schema.Types.ObjectId, ref: "foodpartner" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Dish", dishSchema);
