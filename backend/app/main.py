import os
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
from datetime import datetime

from . import crud, models, schemas
from .database import engine, get_db
from .services.ai_model import predict_run_type # Import the prediction function
from .models import RunStatus # Import RunStatus for setting planned runs

from .routers import network

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

@app.get("/runs/planned", response_model=List[schemas.RunResponse])
def read_planned_runs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Retrieve all planned runs with pagination.
    """
    runs = crud.get_planned_runs(db, skip=skip, limit=limit)
    return runs

@app.post("/runs/predict", response_model=schemas.RunPredictionResponse)
def predict_and_plan_run(
    prediction_request: schemas.RunPredictionRequest, 
    db: Session = Depends(get_db)
):
    # 1. Prepare features for the prediction model
    features_for_prediction = {
        "distance": prediction_request.distance,
        "time": prediction_request.time,
        "average_speed": prediction_request.average_speed,
        "name": prediction_request.name
    }
    # Remove None values as predict_run_type's heuristic might not handle them well if not all are present
    # and the model itself expects numerical inputs (or scaled Nones if handled that way).
    # The current ai_model.py heuristic `assign_run_type_label` uses .get(key, 0) or 0, so Nones become 0.
    # The ML model part expects numerical values.
    # For simplicity, we'll pass them as-is and let predict_run_type handle it.
    # If any required field for the model (distance, time, average_speed) is None, prediction might be less accurate or fall back to heuristic.

    # 2. Get prediction from the AI model
    predicted_type = predict_run_type(run_features=features_for_prediction)

    # 3. Create a new "planned" run
    planned_run_data = schemas.RunCreate(
        name=prediction_request.name or f"{predicted_type} (AI Suggested)",
        distance=prediction_request.distance,
        time=prediction_request.time,
        average_speed=prediction_request.average_speed,
        status=RunStatus.PLANNED, # Set status to PLANNED
        settings_snapshot={
            "user_inputs": prediction_request.model_dump(),
            "predicted_run_type": predicted_type,
            "ai_model_version": "0.1.0" 
        }
    )
    
    db_planned_run = crud.create_run(db=db, run=planned_run_data)

    # 4. Return the created planned run along with the prediction type
    # Convert db_planned_run (models.Run) to schemas.Run, then add predicted_type for RunPredictionResponse
    
    # Use model_validate to convert SQLAlchemy model to Pydantic model
    run_response_part = schemas.Run.model_validate(db_planned_run)
    
    # Construct the final response
    final_response = schemas.RunPredictionResponse(
        **run_response_part.model_dump(), # Spread fields from Run
        predicted_run_type=predicted_type
    )
    
    return final_response

@app.get("/runs/stats", response_model=schemas.StatsResponse)
def get_run_stats(db: Session = Depends(get_db)):
    """
    Retrieves statistics about completed runs, grouped by week, month, and year.
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

app.include_router(network.router)