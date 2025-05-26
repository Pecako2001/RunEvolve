from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any

class RunBase(BaseModel):
    name: Optional[str] = None
    settings_snapshot: Optional[Dict[Any, Any]] = None

class RunCreate(RunBase):
    copied_from: Optional[int] = None

class Run(RunBase):
    id: int
    created_at: datetime
    copied_from: Optional[int] = None

    class Config:
        from_attributes = True

class RunResponse(Run):
    pass
