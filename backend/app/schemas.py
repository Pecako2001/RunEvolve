from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any
from .models import RunStatus # Import the enum

class RunBase(BaseModel):
    name: Optional[str] = None
    settings_snapshot: Optional[Dict[Any, Any]] = None
    distance: Optional[float] = None
    time: Optional[int] = None # Assuming in seconds
    average_speed: Optional[float] = None
    heart_rate: Optional[int] = None
    status: Optional[RunStatus] = RunStatus.COMPLETED # Default to completed

class RunCreate(RunBase):
    copied_from: Optional[int] = None
    # status will be inherited from RunBase, default can be overridden on creation

class Run(RunBase): # This is effectively RunResponse
    id: int
    created_at: datetime
    copied_from: Optional[int] = None
    status: RunStatus # Ensure status is present in the response

    class Config:
        from_attributes = True

# RunResponse can be an alias or removed if Run is used directly for responses.
# For clarity, if Run is the main response model, RunResponse might be redundant.
# Let's keep RunResponse as an alias for now, as it's used in main.py.
class RunResponse(Run):
    pass

class StatsResponse(BaseModel):
    weekly: Dict[str, Dict[str, Any]] = {}
    monthly: Dict[str, Dict[str, Any]] = {}
    yearly: Dict[str, Dict[str, Any]] = {}

# New Schemas for AI Prediction Endpoint
class RunPredictionRequest(BaseModel):
    distance: Optional[float] = None
    time: Optional[int] = None # in seconds
    average_speed: Optional[float] = None # km/h
    name: Optional[str] = "AI Suggested Run" 

class RunPredictionResponse(RunResponse): # Inherits from RunResponse (which inherits from Run)
    predicted_run_type: str
