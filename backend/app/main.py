import os
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
from datetime import datetime

from . import crud, models, schemas
from .database import engine, get_db

# Load environment variables from .env file
load_dotenv()

# Create database tables
# This should ideally be handled by Alembic in a production application
# but for this project, we'll create them on startup.
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/runs/new-from-last", response_model=schemas.RunResponse)
def create_new_run_from_last(db: Session = Depends(get_db)):
    """
    Creates a new run by copying settings from the most recent previous run.
    If no previous runs exist, it returns a 404 error.
    """
    last_run = crud.get_last_run(db=db)
    if last_run is None:
        raise HTTPException(status_code=404, detail="No previous runs found to copy from.")
    
    new_run = crud.create_run_from_previous(db=db, last_run=last_run)
    return new_run

@app.get("/runs/last", response_model=schemas.RunResponse)
def get_latest_run(db: Session = Depends(get_db)):
    """
    Retrieves the most recent run.
    If no runs exist, it returns a 404 error.
    """
    last_run = crud.get_last_run(db=db)
    if last_run is None:
        raise HTTPException(status_code=404, detail="No previous runs found.")
    return last_run

@app.get("/runs", response_model=List[schemas.RunResponse])
def read_runs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Retrieve all runs with pagination.
    """
    runs = crud.get_runs(db, skip=skip, limit=limit)
    return runs

@app.get("/runs/stats", response_model=schemas.StatsResponse)
def get_run_stats(db: Session = Depends(get_db)):
    """
    Retrieves statistics about runs, grouped by week, month, and year.
    """
    runs = crud.get_runs(db=db, limit=None)
    stats = {"weekly": {}, "monthly": {}, "yearly": {}}

    for run in runs:
        # Weekly stats
        year_week = f"{run.created_at.isocalendar().year}-W{run.created_at.isocalendar().week:02d}"
        if year_week not in stats["weekly"]:
            stats["weekly"][year_week] = {"count": 0, "total_distance": 0.0}
        stats["weekly"][year_week]["count"] += 1
        stats["weekly"][year_week]["total_distance"] += run.distance if run.distance else 0.0

        # Monthly stats
        year_month = f"{run.created_at.year}-{run.created_at.month:02d}"
        if year_month not in stats["monthly"]:
            stats["monthly"][year_month] = {"count": 0, "total_distance": 0.0}
        stats["monthly"][year_month]["count"] += 1
        stats["monthly"][year_month]["total_distance"] += run.distance if run.distance else 0.0

        # Yearly stats
        year = str(run.created_at.year)
        if year not in stats["yearly"]:
            stats["yearly"][year] = {"count": 0, "total_distance": 0.0}
        stats["yearly"][year]["count"] += 1
        stats["yearly"][year]["total_distance"] += run.distance if run.distance else 0.0
    
    return stats

@app.get("/strava/auth")
async def strava_auth_placeholder():
    return {"message": "Strava auth placeholder"}

@app.post("/strava/webhook")
async def strava_webhook_placeholder():
    return {"message": "Strava webhook placeholder"}

@app.get("/strava/fetch")
async def strava_fetch_placeholder():
    return {"message": "Strava fetch placeholder"}
