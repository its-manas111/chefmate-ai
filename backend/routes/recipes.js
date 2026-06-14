import express from "express";
import { getRecipesFromAgent } from "../services/agentService.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { ingredients, preferences } = req.body;

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({
        error: "ingredients must be a non-empty array.",
      });
    }

    const result = await getRecipesFromAgent(
      ingredients,
      preferences
    );

    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

export default router;
