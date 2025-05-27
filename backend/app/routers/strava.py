from fastapi import APIRouter
from dotenv import load_dotenv

from app.services.strava.athlete import fetch_athlete_zones

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
async def get_athlete_zones():
    """
    API endpoint to get the athlete's heart rate and power zones from Strava.
    """
    return fetch_athlete_zones(ACCESS_TOKEN)
