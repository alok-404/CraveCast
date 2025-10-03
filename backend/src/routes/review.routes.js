const express = require("express");
const reviewController = require("../controllers/review.controller"); // नया Controller
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

/* POST /api/reviews/submit */
// User द्वारा Restaurant (Partner) को review और rating देने के लिए
router.post(
    "/submit",
    authMiddleware.authUserMiddleware,
    reviewController.submitReview
);

/* GET /api/reviews/:partnerId */

router.get(
    "/:partnerId",
    authMiddleware.authUserMiddleware,
    reviewController.getReviewsByPartner
);


// DELETE /api/reviews/:id
router.delete(
  "/:id",
  authMiddleware.authUserMiddleware,
  reviewController.deleteReview
);


module.exports = router;