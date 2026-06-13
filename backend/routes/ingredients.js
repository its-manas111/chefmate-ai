import express from "express";
import multer from "multer";
import { extractIngredientsFromImage } from "../services/visionService.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 8 * 1024 * 1024,
  },
});

router.post("/", upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "Upload an image using the multipart field name 'image'.",
      });
    }

    const ingredients = await extractIngredientsFromImage(
      req.file.buffer,
      req.file.mimetype
    );

    return res.json({ ingredients });
  } catch (error) {
    return next(error);
  }
});

export default router;
