const express = require('express');
const authController = require("../controllers/auth.controller");
const { authUserMiddleware, authFoodPartnerMiddleware } = require('../middlewares/auth.middleware');


const router = express.Router();

//user auth APIs

router.post('/user/register' , authController.registerUser)
router.post('/user/login' , authController.loginUser)
router.get('/user/logout' , authController.logoutUser)


// ===== USER PROFILE APIs =====
router.get('/user/profile', authUserMiddleware, authController.getUserProfile);
router.put('/user/update', authUserMiddleware, authController.updateUser);  // update user profile

//Food Partner auth APIs

router.post('/food-partner/register' , authController.registerFoodPartner)
router.post('/food-partner/login' , authController.loginFoodPartner)
router.get('/food-partner/logout' , authController.logoutFoodPartner)

// ===== FOOD PARTNER PROFILE API =====
router.get('/food-partner/profile', authFoodPartnerMiddleware, authController.getFoodPartnerProfile);

module.exports = router