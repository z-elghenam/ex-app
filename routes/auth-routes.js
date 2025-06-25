const express = require("express");
const {
  register,
  login,
  getUserProfile,
} = require("../controllers/auth-controller");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, getUserProfile);

module.exports = router;
