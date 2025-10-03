const express = require("express");
const foodController = require("../controllers/food.controller");
// console.log(foodController);
const authMiddleware = require("../middlewares/auth.middleware");
const multer = require("multer");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
}); //middleware so that express can understand

/* POST /api/food/ <= this is Prefix {protected} because only food partner can add food , normal user can't*/

router.post(
  "/",
  authMiddleware.authFoodPartnerMiddleware,
  upload.single("video"), //name kux bhe ho shkta haibs frontend mn bhe use krna pdega
  foodController.createFood
);

/* GET /api/food/ [protected] this is for our user jitne bhe food items kii reel ayegi uske liye*/
/* this is for normal user toh new middleware create krna pdega */

router.get("/", authMiddleware.authUserMiddleware, foodController.getFoodItems);







/*like */
router.post(
    "/:foodId/like", // <--- CHANGE: Food ID added to URL
    authMiddleware.authUserMiddleware,
    foodController.likeFood
);

/*save */
router.post(
    "/:foodId/save", // <--- CHANGE: Food ID added to URL
    authMiddleware.authUserMiddleware,
    foodController.saveFood
);

// Create comment on a food (This route was already correct!)
router.post(
    "/:foodId/comment",
    authMiddleware.authUserMiddleware,
    foodController.addComment
);

// Get comments for a food
router.get(
  "/:foodId/comments",
  authMiddleware.authUserMiddleware,
  foodController.getComments
);

// Delete comment
router.delete(
  "/:foodId/comment/:commentId",
  authMiddleware.authUserMiddleware,
  foodController.deleteComment
);

router.get(
  "/:foodId/status",
  authMiddleware.authUserMiddleware,
  foodController.getFoodStatus
);



// GET all saved reels for the logged-in user
router.get("/user/saved-reels", authMiddleware.authUserMiddleware, foodController.getSavedReels);


module.exports = router;
