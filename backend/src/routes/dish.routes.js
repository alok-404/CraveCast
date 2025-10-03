const express = require("express");
const foodController = require("../controllers/food.controller");
// console.log(foodController);
const authMiddleware = require("../middlewares/auth.middleware");
const multer = require("multer");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
}); //middleware so that express can understand



// for dish create

// POST /api/dish/ => Protected for food partners
router.post(
  "/",
  authMiddleware.authFoodPartnerMiddleware,
  upload.single("image"),
  foodController.createDish
);

// GET /api/dish/ => List dishes (optional)
router.get("/", foodController.getDishes);





module.exports = router