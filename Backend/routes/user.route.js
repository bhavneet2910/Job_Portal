import express from "express";
import { getCurrentUser, login, logout, register, updateProfile, serveResume } from "../controllers/user.controller.js";
import isAuthenticated from "../auth/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/current-user").get(isAuthenticated, getCurrentUser);
router.route("/profile/update").post(isAuthenticated, singleUpload, updateProfile);
router.route("/resume/:userId").get(isAuthenticated, serveResume);

export default router;