import express from "express";
import { changePassword, login, logout, register, resetPassword, updateProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";

const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/reset-password").post(resetPassword);
router.route("/change-password").post(changePassword);
router.route("/profile/update").post(isAuthenticated, singleUpload, updateProfile);

export default router;

