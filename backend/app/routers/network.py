from fastapi import APIRouter, Depends, Body, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import schemas
from app.services.ai_model import get_run_plan, generate_training_plan, train_models


router = APIRouter(prefix="/network", tags=["network"])

@router.get("/stats", response_model=schemas.StatsResponse)
def get_network_stats(db: Session = Depends(get_db)):
    runs = __import__("app.crud", fromlist=["get_runs"]).get_runs(db=db)
    stats = {"weekly": {}, "monthly": {}, "yearly": {}}
    for run in runs:
        yw = run.created_at.isocalendar()
        wk = f"{yw.year}-W{yw.week:02d}"
        stats["weekly"].setdefault(wk, {"count": 0, "total_distance": 0.0})
        stats["weekly"][wk]["count"] += 1
        stats["weekly"][wk]["total_distance"] += run.distance or 0.0

        ym = f"{run.created_at.year}-{run.created_at.month:02d}"
        stats["monthly"].setdefault(ym, {"count": 0, "total_distance": 0.0})
        stats["monthly"][ym]["count"] += 1
        stats["monthly"][ym]["total_distance"] += run.distance or 0.0

        yr = str(run.created_at.year)
        stats["yearly"].setdefault(yr, {"count": 0, "total_distance": 0.0})
        stats["yearly"][yr]["count"] += 1
        stats["yearly"][yr]["total_distance"] += run.distance or 0.0

    return stats

@router.post("/plan", response_model=schemas.RunPredictionResponse)
def generate_plan(payload: schemas.RunPredictionRequest):
    return get_run_plan(payload.dict())

@router.post("/plan/custom", response_model=schemas.RunPlanResponse)
def custom_plan(request: schemas.RunPlanRequest):
    plan = generate_training_plan(request.run_type, request.distance or 0.0)
    return {"run_type": plan["run_type"], "training_plan": plan["training_plan"]}

@router.post("/train")
def retrain_model(db: Session = Depends(get_db)):
    """
    Trigger training of classifier + regressor on all completed runs.
    """
    try:
        train_models(limit=10000)
    except RuntimeError as e:
        # Known training issues such as insufficient data
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        # Unexpected failures
        raise HTTPException(status_code=500, detail=f"Training failed: {e}")

    return {"detail": "Model retrained successfully"}