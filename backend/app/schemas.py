from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any

class RunBase(BaseModel):
    name: Optional[str] = None
    settings_snapshot: Optional[Dict[Any, Any]] = None
    distance: Optional[float] = None
    time: Optional[int] = None
    average_speed: Optional[float] = None
    heart_rate: Optional[int] = None

class RunCreate(RunBase):
    copied_from: Optional[int] = None

class Run(RunBase):
    id: int
    created_at: datetime
    copied_from: Optional[int] = None
    distance: Optional[float] = None
    time: Optional[int] = None
    average_speed: Optional[float] = None
    heart_rate: Optional[int] = None

    class Config:
        from_attributes = True

class RunResponse(Run):
    pass

class StatsResponse(BaseModel):
    weekly: Dict[str, Dict[str, Any]] = {}
    monthly: Dict[str, Dict[str, Any]] = {}
    yearly: Dict[str, Dict[str, Any]] = {}
