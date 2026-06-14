# ChefMate AI

ChefMate AI is a full-stack recipe assistant that helps users discover meals from available ingredients. It combines:
- image-based ingredient extraction using Azure OpenAI Vision,
- recipe generation via a Python-based Foundry agent wrapper,
- a React + Vite frontend for input, preferences, and recipe display.

---

## Features

- Upload fridge or pantry photos to extract ingredients
- Manually add ingredient text
- Recipe recommendations based on available ingredients
- Dietary preferences: vegetarian, eggetarian, non-veg
- Cuisine filtering and prep-time preferences
- Waste-minimizer mode for using existing ingredients
- Recipe cards with match score, missing ingredients, nutrition, and steps

---

## Repository Structure

- `backend/`
  - `server.js` Express API server
  - `routes/`
    - `ingredients.js` image upload and ingredient extraction endpoint
    - `recipes.js` recipe generation endpoint
  - `services/`
    - `visionService.js` Azure OpenAI vision request and parsing
    - `agentService.js` executes `agent_wrapper.py` and parses output
  - `agent_wrapper.py` Python wrapper that calls a Foundry agent
  - `package.json` backend dependencies and scripts

- `frontend/`
  - `src/`
    - `App.jsx` main app logic and API calls
    - `main.jsx` React entry point
    - `components/` UI components
      - `IngredientInput.jsx`
      - `PreferencePanel.jsx`
      - `RecipeList.jsx`
      - `RecipeCard.jsx`
      - `LoadingSpinner.jsx`
  - `package.json` frontend dependencies and scripts
  - `vite.config.js` Vite config
  - `index.html` app shell

- `Hackathon/`
  - Additional documentation and rules unrelated to app logic

---

## Setup

### Prerequisites

- Node.js 18+ recommended
- Python 3.10+ (recommended 3.11+)
- Azure OpenAI / Azure AI Projects access
- `python` available on PATH

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

---

## Environment Configuration

### Backend `.env`

Create `backend/.env` with:

```env
CLIENT_ORIGIN=http://localhost:5173
PORT=3001

AZURE_OPENAI_ENDPOINT=https://<your-endpoint>.openai.azure.com
AZURE_OPENAI_API_KEY=<your-vision-api-key>
AZURE_OPENAI_VISION_DEPLOYMENT=gpt-5.4-nano
AZURE_OPENAI_API_VERSION=2025-01-01-preview

AZURE_AI_PROJECT_ENDPOINT=<your-azure-ai-project-endpoint>
```

### Frontend `.env`

Create `frontend/.env` with:

```env
VITE_API_BASE_URL=http://localhost:3001
```

---

## Running Locally

### Start backend

```bash
cd backend
npm run dev
```

### Start frontend

```bash
cd frontend
npm run dev
```

Then open the Vite URL shown in the terminal, usually `http://localhost:5173`.

---

## Build

### Frontend build

```bash
cd frontend
npm run build
```

### Backend production

```bash
cd backend
npm start
```

> TODO: add production deployment steps once hosting environment is chosen.

---

## API Documentation

### Health

`GET /`

Response:

```json
{
  "status": "success",
  "message": "ChefMate API running"
}
```

### Extract Ingredients

`POST /api/extract-ingredients`

Request:
- multipart/form-data
- field name: `image`

Response:

```json
{
  "ingredients": ["tomato", "cheese", "basil"]
}
```

### Get Recipes

`POST /api/get-recipes`

Request JSON:

```json
{
  "ingredients": ["tomato", "cheese", "basil"],
  "preferences": {
    "diet": "veg",
    "timeMinutes": "any",
    "cuisine": "any",
    "leftoverMinimizer": true,
    "nutritionalGoal": "none"
  }
}
```

Response shape:
- `recipes` array of recipe objects
- expected fields: `name`, `cuisine`, `diet`, `timeMinutes`, `matchScore`, `availableIngredients`, `missingIngredients`, `steps`, `nutrition`, `citation`

Alias:
- `POST /api/recipes` routes to the same recipe endpoint

---

## Development Notes

- Frontend:
  - React 19
  - Vite 8
  - Tailwind CSS via `@tailwindcss/vite`
  - ESLint available via `npm run lint`

- Backend:
  - Express 5
  - `multer` for image uploads
  - Azure OpenAI Vision request built manually in `visionService.js`
  - Python wrapper runs `agent_wrapper.py` via `child_process`
  - `agent_wrapper.py` uses `agent_framework_foundry` and `azure.identity.aio.DefaultAzureCredential`

---

## Deployment

- Backend can deploy as a Node service
- Frontend can deploy as a static Vite build
- Ensure CORS origin and API base URL are configured for production
- Ensure Azure secrets are stored securely and not committed

---

## Future Features

* **Recipe video linking**

  * Add relevant cooking video links for each recommended recipe.
  * Support embedded step-by-step video tutorials from trusted cooking platforms.

* **Nutrient tracking**

  * Track calories, protein, carbohydrates, fats, fiber, and key micronutrients.
  * Provide daily or weekly nutrition summaries based on selected recipes.

* **Liked and favourite recipes**

  * Allow users to like, save, and favourite recipes.
  * Use saved recipe history to personalize future recommendations.

* **Personalized meal suggestions**

  * Recommend meals based on user preferences, previous selections, dietary patterns, and frequently used ingredients.
  * Improve recipe ranking over time using user feedback.

* **Meal planning**

  * Add a weekly meal planner with breakfast, lunch, dinner, and snack slots.
  * Suggest balanced meal combinations based on nutrition goals and available ingredients.

* **Smart grocery list generation**

  * Automatically generate a grocery list from missing ingredients.
  * Group items by category such as vegetables, dairy, grains, spices, and proteins.

* **Expiry-aware ingredient suggestions**

  * Let users enter or scan ingredient expiry dates.
  * Prioritize recipes that use ingredients close to expiry to reduce food waste.

---

## Contributors

- Manas Khandelwal
  - GitHub: https://github.com/its-manas111
  - Microsoft Learn username: ManasKhandelwal-1024

- Shristi Agarwal
  - GitHub: https://github.com/shristiagarwal18
  - Microsoft Learn username: ShristiAgarwal-4831

---

## Contributing

- Use the existing repo structure: backend and frontend separate
- Keep environment secrets out of version control
- Add tests and CI as needed
- lint frontend with:

```bash
cd frontend
npm run lint
```

