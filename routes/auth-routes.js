const express = require("express");
const {
  register,
  login,
  getUserProfile,
  verifyEmail,
  forgotPassword,
  resetPassword,
  updateUserProfile,
} = require("../controllers/auth-controller");
const { auth } = require("../middleware/auth");

const router = express.Router();

// @route POST /api/auth/register
// @desc register user
// @access Public
router.post("/register", register);

// @route POST /api/auth/login
// @desc Login user
// @access Public
router.post("/login", login);

// @route GET /api/auth/verify-email?token=*****
// @desc Verify email with token
// @access Public
router.get("/verify-email", verifyEmail);

// @route POST /api/auth/forgot-password
// @desc Send password reset email
// @access Public
router.post("/forgot-password", forgotPassword);

// @route POST /api/auth/reset-password?token=*****
// @desc Reset password with token
// @access Public
router.post("/reset-password", resetPassword);

// @route GET /api/auth/me
// @desc Get current user
// @access Private
router.get("/me", auth, getUserProfile);

// @route PUT /api/auth/profile
// @desc Update user profile
// @access Private
router.put("/update-profile", auth, updateUserProfile);

module.exports = router;
