from fastapi import APIRouter, Depends, Body, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import schemas
from app.services.ai_model import get_run_plan, generate_training_plan, train_models


router = APIRouter(prefix="/network", tags=["network"])


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