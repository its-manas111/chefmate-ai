import express from "express";
import { getRecipesFromAgent } from "../services/agentService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { ingredients, preferences } = req.body;

    // Validate ingredients
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({
        error: "ingredients must be a non-empty array.",
      });
    }

    const result = await getRecipesFromAgent(
      ingredients,
      preferences || {}
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("Recipes Route Error:", error);

    return res.status(500).json({
      error:
        error.message ||
        "Failed to generate recipe recommendations.",
    });
  }
});

export default router;