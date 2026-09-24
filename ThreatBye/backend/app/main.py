from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.upload import router as upload_router
from app.api.investigation import router as investigation_router
from app.api.gmail import router as gmail_router


app = FastAPI(
    title="ThreatBye API",
    description="AI-powered email threat detection and forensic intelligence platform",
    version="1.0.0"
)


# Allow the ThreatBye frontend to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://threatbye-frontend.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(upload_router)
app.include_router(investigation_router)
app.include_router(gmail_router)


@app.get("/")
def root():
    return {
        "message": "ThreatBye Backend is running!"
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "ThreatBye Backend"
    }