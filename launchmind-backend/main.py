from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import analyze, plan, questions

app = FastAPI(title="LaunchMind API")

# Allow all origins for dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router, prefix="/api")
app.include_router(plan.router, prefix="/api")
app.include_router(questions.router, prefix="/api")

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "model": "gemini-1.5-flash"}
