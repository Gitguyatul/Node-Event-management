const express = require("express");
const router = express.Router();
const authController = require("../Node-Event-Management-System/controllers/authController");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
const adminAuth = require("../middleware/adminMiddleware");

module.exports = router;
