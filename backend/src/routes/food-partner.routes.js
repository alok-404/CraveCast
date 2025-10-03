const express = require("express");
const foodPartnerController = require("../controllers/food-partner.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

/* GET /api/food-partner/ [protected] This is for our normal user to get the list of restaurants for the home page */
router.get(
    "/",
    // authMiddleware.authUserMiddleware, // User authenticated hona chahiye
    foodPartnerController.getFoodPartners // Naya controller function
);

/*GET /api/food-partner/:id */
router.get(
  "/:id",
  authMiddleware.authUserMiddleware,
  foodPartnerController.getFoodPartnerById
);





module.exports = router;
