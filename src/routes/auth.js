const express = require("express");
const { register, login } = require("../controllers/authController");
const { loginLimiter } = require("../middlewares/rateLimiter");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", loginLimiter, login); // ← Rate limiter applied here

module.exports = router;
