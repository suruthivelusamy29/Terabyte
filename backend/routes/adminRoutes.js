import express from "express";
import { getStats, getAllUsers, deleteUser, getAllVideos } from "../controllers/adminController.js";
import { createVideo, updateVideo, deleteVideo } from "../controllers/videoController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();
router.use(protect, adminOnly);

router.get("/stats", getStats);
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.get("/videos", getAllVideos);
router.post("/videos", createVideo);
router.put("/videos/:id", updateVideo);
router.delete("/videos/:id", deleteVideo);

export default router;
