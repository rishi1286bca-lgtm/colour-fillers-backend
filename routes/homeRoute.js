import express from "express";
import multer from "multer";
import {
  getHomeContent,
  updateHomeContent,
  uploadHomeImage,
  deleteHomeImage,
} from "../controllers/homeController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Memory storage — buffer is streamed straight to Cloudinary
// by uploadToCloud(), same pattern as your existing cloudUpload.js util.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per image
});

// Public — frontend fetches the whole page's content in one call
router.get("/", getHomeContent);

// Admin — edit content (text/arrays) and manage images
router.put("/", protect, updateHomeContent);
router.post("/upload", protect, upload.single("image"), uploadHomeImage);
router.delete("/upload", protect, deleteHomeImage);

export default router;
