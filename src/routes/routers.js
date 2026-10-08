const express = require('express');
const router = express.Router();
const { authController, dashboardController } = require('../controllers');
const { apis } = require('../constants');
const { verifyToken } = require('../utils/jwt');

router.get('/dashboard', dashboardController.getDashboard);

router.get(apis.auth.getLoggedInUser, verifyToken, authController.getLoggedInUser);
router.get(apis.auth.getUserProfile, verifyToken, authController.getUserProfile);
router.post(apis.auth.userEmailLogin, authController.userEmailLogin);
router.get(apis.auth.logoutUser, verifyToken, authController.logoutUser);
router.post(apis.auth.validateEmailLLogin, authController.validateEmailLLogin);
router.post(apis.auth.updateUserProfile, verifyToken, authController.updateUserProfile);

module.exports = router;
