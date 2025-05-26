from sqlalchemy.orm import Session
from sqlalchemy import desc
from . import models, schemas

def get_last_run(db: Session) -> models.Run | None:
    """
    Retrieves the most recent Run record from the database.
    """
    return db.query(models.Run).order_by(desc(models.Run.created_at)).first()

def create_run(db: Session, run: schemas.RunCreate) -> models.Run:
    """
    Creates a new Run record in the database.
    """
    db_run = models.Run(
        name=run.name,
        settings_snapshot=run.settings_snapshot,
        copied_from=run.copied_from
    )
    db.add(db_run)
    db.commit()
    db.refresh(db_run)
    return db_run

def create_run_from_previous(db: Session, last_run: models.Run) -> models.Run:
    """
    Creates a new Run based on a previous one.
    """
    run_data = schemas.RunCreate(
        name=last_run.name,  # Copying name from the last run
        settings_snapshot=last_run.settings_snapshot,
        copied_from=last_run.id
    )
    return create_run(db=db, run=run_data)

def get_runs(db: Session, skip: int = 0, limit: int = 100) -> list[models.Run]:
    """
    Retrieves a list of Run records from the database with pagination.
    Orders by created_at descending.
    """
    return db.query(models.Run).order_by(desc(models.Run.created_at)).offset(skip).limit(limit).all()
