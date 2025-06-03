import os
import pytest
import pytest_asyncio
import asyncio
import uuid
from httpx import AsyncClient
import httpx
from sqlalchemy.orm import Session

# Use SQLite for tests if DATABASE_URL not provided
os.environ.setdefault("DATABASE_URL", "sqlite:///./test.db")

# Adjust imports to reflect the project structure
# Assuming 'app' is the root package for the application code
from app.main import app  # FastAPI app instance
from app.database import SessionLocal, engine  # DB session factory
from app.models import Base, Run as RunModel, User as UserModel  # SQLAlchemy models
from app.schemas import RunCreate # Pydantic schema for creation
from app.crud import create_run # CRUD function

# Ensure tables are created for the SQLite test database
Base.metadata.create_all(bind=engine)

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

@pytest_asyncio.fixture()
async def async_client():
    """
    Provides an HTTPX AsyncClient for making requests to the FastAPI app.
    """
    # Ensure the app's lifespan events are processed if any (e.g., startup/shutdown)
    # Forcing lifespan events if not automatically handled by AsyncClient in test mode.
    # However, recent versions of FastAPI and httpx handle this better.
    # If startup/shutdown logic is critical and not firing, this might be needed:
    transport = httpx.ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
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
        settings_snapshot={"setting1": "value1", "fixture_id": str(uuid.uuid4())},
        distance=5.0,
        time=1800,
        average_speed=8.0
    )
    created_run = create_run(db=db_session, run=run_create_data)
    yield created_run
    # No explicit delete for simplicity in this iteration.
    # If needed, one could add:
    # db_session.delete(created_run)
    # db_session.commit()

@pytest.fixture()
def training_runs(db_session: Session):
    """Insert multiple runs for training purposes."""
    runs = []
    for i in range(3):
        rc = RunCreate(
            name=f"Train Run {i}",
            settings_snapshot={"src": "training"},
            distance=5.0 + i,
            time=1800 + i * 60,
            average_speed=8.0 + i * 0.5,
        )
        runs.append(create_run(db=db_session, run=rc))
    return runs


@pytest.fixture()
def test_user(db_session: Session):
    """Create a user for authentication tests."""
    from app.routers.auth import _hash_password

    user = UserModel(
        email="admin@example.com",
        hashed_password=_hash_password("admin"),
        first_name="Admin",
        last_name="User",
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user

# Helper used by the autouse fixture to ensure a clean state
def _clear_all_runs(db_session: Session) -> None:
    """Remove all Run and User rows from the database."""
    db_session.query(RunModel).delete()
    db_session.query(UserModel).delete()
    db_session.commit()


@pytest.fixture(autouse=True)
def clear_runs_before_test(db_session: Session):
    """Clear Run table before each test."""
    _clear_all_runs(db_session)
    yield
    _clear_all_runs(db_session)
