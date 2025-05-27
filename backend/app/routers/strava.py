from fastapi import APIRouter, Depends
from dotenv import load_dotenv
import os

from app.services.strava.athlete import (
    fetch_athlete_zones,
    fetch_athlete_stats,
    fetch_athlete_activities,
)
from app.crud import (
    get_cached_zones,
    store_cached_zones,
    get_cached_stats,
    store_cached_stats,
    get_cached_activities,
    store_cached_activities,
)
from app.routers.auth import get_current_user
from app.database import get_db
from sqlalchemy.orm import Session

load_dotenv()

CLIENT_ID     = os.getenv("STRAVA_CLIENT_ID")
CLIENT_SECRET = os.getenv("STRAVA_CLIENT_SECRET")
ACCESS_TOKEN  = os.getenv("STRAVA_ACCESS_TOKEN")
REFRESH_TOKEN = os.getenv("STRAVA_REFRESH_TOKEN")

router = APIRouter(
    prefix="/strava",
    tags=["strava"]
)

@router.get("/")
async def read_root():
    return {"message": "Strava router root"}

@router.get("/athlete/zones")
async def get_athlete_zones(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return heart rate zones, caching per user."""
    cached = get_cached_zones(db, current_user.id)
    if cached:
        return cached.data
    live = fetch_athlete_zones(ACCESS_TOKEN)
    store_cached_zones(db, current_user.id, live)
    return live


@router.get("/athlete/stats")
async def get_athlete_stats(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    cached = get_cached_stats(db, current_user.id)
    if cached:
        return cached.data
    # In a real implementation the athlete id would come from the user record
    athlete = fetch_athlete_zones.__self__ if False else None
    athlete_id = os.getenv("STRAVA_ATHLETE_ID") or "me"
    live = fetch_athlete_stats(ACCESS_TOKEN, athlete_id)
    store_cached_stats(db, current_user.id, live)
    return live


@router.get("/athlete/activities")
async def get_athlete_activities(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    cached = get_cached_activities(db, current_user.id)
    if cached:
        return cached.data
    live = fetch_athlete_activities(ACCESS_TOKEN)
    store_cached_activities(db, current_user.id, live)
    return live
