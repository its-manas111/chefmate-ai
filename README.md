# ChefMate AI

Smart recipe suggestions from fridge photos, typed ingredients, or grocery lists.

Screenshot placeholder: add a demo screenshot here before final submission.

## Features

- Upload a fridge or ingredient photo and extract visible ingredients with Azure OpenAI vision.
- Type or paste ingredients manually, then manage them as removable chips.
- Personalize results by diet, time, cuisine, leftover minimization, and nutrition goal.
- Retrieve grounded recipe suggestions through an Azure AI Foundry agent using Foundry IQ knowledge.
- Rank recipes into a top-five list with match score, missing items, steps, nutrition, and citations.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Lucide React
- Backend: Node.js, Express, Multer, dotenv, CORS
- AI: Azure AI Foundry agent, Foundry IQ knowledge retrieval, Azure OpenAI GPT-5.4-nano vision/text

## Architecture

```text
User
  |
  v
React + Vite frontend
  |-- photo upload ---------> POST /api/extract-ingredients
  |                              |
  |                              v
  |                         Azure OpenAI vision
  |
  |-- ingredients/preferences -> POST /api/get-recipes
                                 |
                                 v
                           Azure AI Foundry Agent
                                 |
                                 v
                       Foundry IQ recipe knowledge base
                                 |
                                 v
                       Ranked recipes with citations
```

## Setup

```bash
git clone <repo-url>
cd chefmate-ai

cd backend
npm install
cp ../.env.example .env
npm run dev

cd ../frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`. Backend runs on `http://localhost:3001` by default.

## Environment

Create `backend/.env` from `.env.example` and set:

- `PROJECT_ENDPOINT` and `AGENT_NAME` for the Azure AI Foundry agent.
- `AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_API_KEY`, and `AZURE_OPENAI_VISION_DEPLOYMENT` for image ingredient extraction.
- `CLIENT_ORIGIN` if the frontend runs somewhere other than `http://localhost:5173`.

## Foundry IQ Usage

ChefMate AI uses an Azure AI Foundry agent as the recipe intelligence layer. The agent is expected to retrieve recipes from a Foundry IQ-backed recipe knowledge base, ground suggestions in indexed content, and return citations with each result. The backend keeps this integration in `backend/services/agentService.js` so recipe retrieval and ranking stay centralized.

## GitHub Copilot Usage

GitHub Copilot was used in VS Code to accelerate component scaffolding, API route wiring, prompt iteration, and README drafting. Final implementation choices were reviewed against the hackathon requirements for API shape, citation support, responsive UI, and safe environment-variable handling.

## Team

- Name:
- GitHub:
- Demo video:
- Submission track: Creative Apps
