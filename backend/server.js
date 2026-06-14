
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import ingredientRoutes from "./routes/ingredients.js";
import recipeRoutes from "./routes/recipes.js";

dotenv.config();

const app = express();
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: CLIENT_ORIGIN,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "ChefMate API running",
  });
});

app.use("/api/extract-ingredients", ingredientRoutes);
app.use("/api/get-recipes", recipeRoutes);
app.use("/api/recipes", recipeRoutes);

app.use((error, req, res, next) => {
  console.error(error);

  if (res.headersSent) {
    return next(error);
  }

  const payload = {
    error: error.message || "Unexpected server error.",
  };

  // Include details/stacktrace in non-production for easier debugging
  if (process.env.NODE_ENV !== "production") {
    if (error.details) payload.details = error.details;
    if (error.stack) payload.stack = error.stack;
  }

  return res.status(error.status || 500).json(payload);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
