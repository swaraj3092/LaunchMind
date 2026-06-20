# LaunchMind

AI-powered startup idea validator and execution planner.

## Project Structure

```
USAII/
├── frontend/          # React + Vite frontend
├── launchmind-backend/  # FastAPI + Gemini backend
└── images/            # Assets
```

## Setup

### 1. Backend

```bash
cd launchmind-backend
pip install -r requirements.txt
cp .env.example .env
# Add your Gemini API key to .env
uvicorn main:app --reload
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

| Variable         | Where          | Description                |
|-----------------|----------------|----------------------------|
| `GEMINI_API_KEY` | `launchmind-backend/.env` | Google Gemini API key |

## Tech Stack

- **Frontend**: React, Vite, Framer Motion, Lucide Icons
- **Backend**: FastAPI, Google Gemini 2.5 Flash, DuckDuckGo Search
- **AI**: Roast Mode (Devil's Advocate) + Standard Mode
