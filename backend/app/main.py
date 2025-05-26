from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

from . import crud, models, schemas
from .database import engine, get_db

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
