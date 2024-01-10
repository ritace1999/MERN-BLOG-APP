import express from "express";
import AuthController from "../../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", AuthController.registerWithOTP);
router.post("/verify-otp", AuthController.verifyOTP);

router.post("/login", AuthController.login);
router.post("/forgot-password", AuthController.forgotPassword);
router.put("/reset-password/:token", AuthController.resetPassword);

export default router;
