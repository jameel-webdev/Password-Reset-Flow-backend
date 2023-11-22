import express from "express";
import {
  registerUser,
  authUser,
  logOutUser,
  forgotPassword,
  resetPassword,
} from "../controllers/userControllers.js";

const router = express.Router();

// REGISTRATION
router.route("/register").post(registerUser);
// LOGIN
router.route("/login").post(authUser);
// LOGOUT
router.route("/logout").post(logOutUser);

// FORGOT PASSWORD
router.route("/forgotpassword").post(forgotPassword);
// RESET PASSWORD
router.route("/resetpassword/:token").put(resetPassword);

export default router;
