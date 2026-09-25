const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const authenticateUser =require("../middlewares/auth.middleware");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forget_pass", authController.forgetPassword);
router.post("/verify-otp", authController.verifyOTP);
router.post("/reset-password", authController.resetPassword);
router.post("/logout", authController.logout);
router.get("/me",authenticateUser,authController.me);
router.post(
    "/verify-registration",
    authController.verifyRegistration
);
router.post(
    "/resend-verification",
    authController.resendVerificationOTP
);

module.exports = router;