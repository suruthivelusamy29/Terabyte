import express from "express";
import {
  register, login, getProfile, updateProfile,
  toggleWatchlist, saveProgress, getProgress,
  getNotifications, markNotificationsRead,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.post("/watchlist", protect, toggleWatchlist);
router.post("/progress", protect, saveProgress);
router.get("/progress", protect, getProgress);
router.get("/notifications", protect, getNotifications);
router.put("/notifications/read", protect, markNotificationsRead);

export default router;
