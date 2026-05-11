import express from "express";
import {
  getVideos, getVideoById, getFeatured, getTrending,
  getRecommendations, getByCategory, searchSuggestions,
  toggleLike, toggleDislike, addReview, getReviews,
  createVideo, updateVideo, deleteVideo,
} from "../controllers/videoController.js";
import { protect, optionalProtect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getVideos);
router.get("/featured", getFeatured);
router.get("/trending", getTrending);
router.get("/recommendations", optionalProtect, getRecommendations);
router.get("/search/suggestions", searchSuggestions);
router.get("/category/:category", getByCategory);
router.get("/:id", optionalProtect, getVideoById);
router.get("/:id/reviews", getReviews);
router.put("/:id/like", protect, toggleLike);
router.put("/:id/dislike", protect, toggleDislike);
router.post("/:id/review", protect, addReview);
router.post("/", protect, adminOnly, createVideo);
router.put("/:id", protect, adminOnly, updateVideo);
router.delete("/:id", protect, adminOnly, deleteVideo);

export default router;



