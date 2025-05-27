from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any, List, Union
from .models import RunStatus

class RunBase(BaseModel):
    name: Optional[str] = None
    settings_snapshot: Optional[Dict[Any, Any]] = None
    distance: Optional[float] = None
    time: Optional[int] = None  # in seconds
    average_speed: Optional[float] = None  # km/h
    heart_rate: Optional[int] = None
    status: Optional[RunStatus] = RunStatus.COMPLETED

class RunCreate(RunBase):
    copied_from: Optional[int] = None

class Run(RunBase):
    id: int
    created_at: datetime
    copied_from: Optional[int] = None
    status: RunStatus

    class Config:
        from_attributes = True

class RunResponse(Run):
    pass

class StatsResponse(BaseModel):
    weekly: Dict[str, Dict[str, Any]] = {}
    monthly: Dict[str, Dict[str, Any]] = {}
    yearly: Dict[str, Dict[str, Any]] = {}

class RunPredictionRequest(BaseModel):
    name: Optional[str] = "AI Suggested Run"
    distance: Optional[float] = None
    time: Optional[int] = None
    average_speed: Optional[float] = None
    training_plan: Optional[Dict[str, Any]] = None

class RunPredictionResponse(RunResponse):
    predicted_run_type: str
    training_plan: Dict[str, Any]

class RunPlanRequest(BaseModel):
    run_type: str  # “Interval”, “Tempo Run”, “Long Run”, “Easy/Recovery Run”
    distance: Optional[float] = None  # Used for long/easy runs

class RunPlanResponse(BaseModel):
    run_type: str
    training_plan: Union[Dict[str, Any], List[Dict[str, str]]]
