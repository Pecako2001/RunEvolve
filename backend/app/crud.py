from sqlalchemy.orm import Session
from sqlalchemy import desc
from . import models, schemas
from .models import RunStatus # Import RunStatus
from datetime import datetime

def get_last_run(db: Session) -> models.Run | None:
    """
    Retrieves the most recent COMPLETED Run record from the database.
    """
    return db.query(models.Run).filter(models.Run.status == RunStatus.COMPLETED).order_by(desc(models.Run.created_at)).first()

def create_run(db: Session, run: schemas.RunCreate) -> models.Run:
    """
    Creates a new Run record in the database.
    The status is taken from run.status, which defaults to COMPLETED in schemas.RunCreate.
    """
    db_run = models.Run(
        name=run.name,
        settings_snapshot=run.settings_snapshot,
        copied_from=run.copied_from,
        distance=run.distance,
        time=run.time,
        average_speed=run.average_speed,
        heart_rate=run.heart_rate,
        status=run.status  # Status from the input schema
    )
    db.add(db_run)
    db.commit()
    db.refresh(db_run)
    return db_run

def create_run_from_previous(db: Session, last_run: models.Run) -> models.Run:
    """
    Creates a new Run based on a previous one, ensuring its status is COMPLETED.
    """
    run_data = schemas.RunCreate(
        name=last_run.name,  # Copying name from the last run
        settings_snapshot=last_run.settings_snapshot,
        copied_from=last_run.id,
        distance=last_run.distance,
        time=last_run.time,
        average_speed=last_run.average_speed,
        heart_rate=last_run.heart_rate,
        status=RunStatus.COMPLETED # Explicitly set to COMPLETED
    )
    return create_run(db=db, run=run_data)

def get_runs(db: Session, skip: int = 0, limit: int | None = None) -> list[models.Run]:
    """
    Retrieves a list of ``Run`` records from the database with optional
    pagination.  ``limit`` set to ``None`` will return all records.

    Results are ordered by ``created_at`` descending.
    """
    query = db.query(models.Run).order_by(desc(models.Run.created_at)).offset(skip)
    if limit is not None:
        query = query.limit(limit)
    return query.all()
    
def get_completed_runs(db: Session, skip: int = 0, limit: int = 100) -> list[models.Run]:
    """
    Retrieves a list of COMPLETED Run records from the database with pagination.
    Orders by created_at descending.
    """
    return db.query(models.Run).filter(models.Run.status == RunStatus.COMPLETED).order_by(desc(models.Run.created_at)).offset(skip).limit(limit).all()

def get_planned_runs(db: Session, skip: int = 0, limit: int = 100) -> list[models.Run]:
    """
    Retrieves a list of PLANNED Run records from the database with pagination.
    Orders by created_at descending (or by another relevant field like a planned_date if added later).
    """
    return db.query(models.Run).filter(models.Run.status == RunStatus.PLANNED).order_by(desc(models.Run.created_at)).offset(skip).limit(limit).all()


def get_cached_zones(db: Session, user_id: int) -> models.StravaHeartRateZoneCache | None:
    return db.query(models.StravaHeartRateZoneCache).filter(models.StravaHeartRateZoneCache.user_id == user_id).first()


def store_cached_zones(db: Session, user_id: int, data: dict) -> models.StravaHeartRateZoneCache:
    cache = models.StravaHeartRateZoneCache(user_id=user_id, data=data, fetched_at=datetime.utcnow())
    db.add(cache)
    db.commit()
    db.refresh(cache)
    return cache


def get_cached_stats(db: Session, user_id: int) -> models.StravaStatsCache | None:
    return db.query(models.StravaStatsCache).filter(models.StravaStatsCache.user_id == user_id).first()


def store_cached_stats(db: Session, user_id: int, data: dict) -> models.StravaStatsCache:
    cache = models.StravaStatsCache(user_id=user_id, data=data, fetched_at=datetime.utcnow())
    db.add(cache)
    db.commit()
    db.refresh(cache)
    return cache


def get_cached_activities(db: Session, user_id: int) -> models.StravaActivitiesCache | None:
    return db.query(models.StravaActivitiesCache).filter(models.StravaActivitiesCache.user_id == user_id).first()


def store_cached_activities(db: Session, user_id: int, data: dict) -> models.StravaActivitiesCache:
    cache = models.StravaActivitiesCache(user_id=user_id, data=data, fetched_at=datetime.utcnow())
    db.add(cache)
    db.commit()
    db.refresh(cache)
    return cache


def get_cached_activity(db: Session, user_id: int, activity_id: int) -> models.StravaActivityCache | None:
    """Retrieve cached single activity details."""
    return (
        db.query(models.StravaActivityCache)
        .filter(
            models.StravaActivityCache.user_id == user_id,
            models.StravaActivityCache.activity_id == activity_id,
        )
        .first()
    )


def store_cached_activity(db: Session, user_id: int, activity_id: int, data: dict) -> models.StravaActivityCache:
    cache = models.StravaActivityCache(
        user_id=user_id,
        activity_id=activity_id,
        data=data,
        fetched_at=datetime.utcnow(),
    )
    db.add(cache)
    db.commit()
    db.refresh(cache)
    return cache
