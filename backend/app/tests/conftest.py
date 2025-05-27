import pytest
import asyncio
import uuid
from httpx import AsyncClient
from sqlalchemy.orm import Session

# Adjust imports to reflect the project structure
# Assuming 'app' is the root package for the application code
from app.main import app  # FastAPI app instance
from app.database import SessionLocal, engine, Base # For DB session and potentially Base if creating tables
from app.models import Run as RunModel # SQLAlchemy model
from app.schemas import RunCreate # Pydantic schema for creation
from app.crud import create_run # CRUD function

# Ensure tables are created (if using a test-specific DB or in-memory)
# For this subtask, we assume models.Base.metadata.create_all(bind=engine) in main.py handles it.
# If a separate test DB were used, you'd do it here:
# Base.metadata.create_all(bind=engine) # Ensure this uses the correct engine for tests

@pytest.fixture(scope="session")
def event_loop():
    """
    Creates an instance of the default event loop for each test session.
    Needed by pytest-asyncio.
    """
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    yield loop
    loop.close()

@pytest.fixture(scope="function")
async def async_client():
    """
    Provides an HTTPX AsyncClient for making requests to the FastAPI app.
    """
    # Ensure the app's lifespan events are processed if any (e.g., startup/shutdown)
    # Forcing lifespan events if not automatically handled by AsyncClient in test mode.
    # However, recent versions of FastAPI and httpx handle this better.
    # If startup/shutdown logic is critical and not firing, this might be needed:
    # async with LifespanManager(app):
    #     async with AsyncClient(app=app, base_url="http://127.0.0.1:8000") as client:
    #         yield client
    async with AsyncClient(app=app, base_url="http://127.0.0.1:8000") as client:
        yield client

@pytest.fixture(scope="function")
def db_session():
    """
    Provides a SQLAlchemy session for direct database interaction in tests.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture(scope="function")
def setup_run_in_db(db_session: Session):
    """
    Fixture to create a new Run record in the database with a unique name
    and yield the created Run object.
    No cleanup of the created run is performed in this simplified version.
    """
    unique_name = f"Test Run {uuid.uuid4()}"
    run_create_data = RunCreate(
        name=unique_name,
        settings_snapshot={"setting1": "value1", "fixture_id": str(uuid.uuid4())}
    )
    created_run = create_run(db=db_session, run=run_create_data)
    yield created_run
    # No explicit delete for simplicity in this iteration.
    # If needed, one could add:
    # db_session.delete(created_run)
    # db_session.commit()

# Helper used by the autouse fixture to ensure a clean state
def _clear_all_runs(db_session: Session) -> None:
    """Remove all Run rows from the database."""
    db_session.query(RunModel).delete()
    db_session.commit()


@pytest.fixture(autouse=True)
def clear_runs_before_test(db_session: Session):
    """Clear Run table before each test."""
    _clear_all_runs(db_session)
    yield
