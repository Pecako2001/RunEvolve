import pytest
from httpx import AsyncClient
from datetime import datetime, timezone

# Assuming conftest.py is in the same directory or a parent directory recognized by pytest
# No direct import of fixtures needed, pytest handles it.

# Import schemas for validation if necessary, e.g., RunResponse
from app.schemas import RunResponse
from app.models import Run as RunModel # For type hinting the fixture if needed
from app.database import SessionLocal # For direct DB manipulation if a test needs to clear data

# Helper function to clear runs (use with extreme caution, ideally for a test DB)
def _clear_all_runs(db_session):
    # This is a potentially destructive operation.
    # Only use if you are absolutely sure you are on a test/dev database.
    # Consider disabling this or making it configurable.
    db_session.query(RunModel).delete()
    db_session.commit()


@pytest.mark.asyncio
async def test_root(async_client: AsyncClient):
    response = await async_client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello World"}

@pytest.mark.asyncio
async def test_create_run_from_last_no_previous_run(async_client: AsyncClient):
    # This test assumes the database has no runs.
    # For a real test suite, ensure the DB is cleared or use a dedicated test DB.
    # We can try to clear it here, but it's not ideal for shared dev DB.
    # For this subtask, we'll proceed and note this dependency.
    # temp_db = SessionLocal()
    # _clear_all_runs(temp_db) # Risky for shared dev DB
    # temp_db.close()

    response = await async_client.post("/runs/new-from-last")
    assert response.status_code == 404
    assert response.json() == {"detail": "No previous runs found to copy from."}

@pytest.mark.asyncio
async def test_get_last_run_no_run(async_client: AsyncClient):
    # Similar to the test above, this assumes no runs in the DB.
    # temp_db = SessionLocal()
    # _clear_all_runs(temp_db) # Risky
    # temp_db.close()

    response = await async_client.get("/runs/last")
    assert response.status_code == 404
    assert response.json() == {"detail": "No previous runs found."}

@pytest.mark.asyncio
async def test_create_run_from_last_with_previous_run(async_client: AsyncClient, setup_run_in_db: RunModel):
    previous_run = setup_run_in_db # This run is created by the fixture

    response = await async_client.post("/runs/new-from-last")
    assert response.status_code == 200
    
    new_run_data = response.json()
    # Validate with RunResponse schema if Pydantic model is available and configured for testing
    # For now, basic checks:
    assert "id" in new_run_data
    assert new_run_data["copied_from"] == previous_run.id
    assert new_run_data["name"] == previous_run.name # As per current crud logic
    assert new_run_data["settings_snapshot"] == previous_run.settings_snapshot

    # Check timestamp
    previous_run_created_at = previous_run.created_at.replace(tzinfo=timezone.utc) # Ensure timezone aware
    new_run_created_at = datetime.fromisoformat(new_run_data["created_at"]).replace(tzinfo=timezone.utc)
    assert new_run_created_at > previous_run_created_at

@pytest.mark.asyncio
async def test_get_last_run_with_run(async_client: AsyncClient, setup_run_in_db: RunModel):
    # The setup_run_in_db fixture ensures a run exists.
    # Since the fixture creates a new unique run, it should be the last one.
    # However, if other tests run in parallel or leave data, this might not be strictly true
    # without a clean DB state. The fixture creates a *new* run.
    # For this test, we assume it will be the last one fetched.
    
    expected_run = setup_run_in_db

    response = await async_client.get("/runs/last")
    assert response.status_code == 200
    
    last_run_data = response.json()
    assert last_run_data["id"] == expected_run.id
    assert last_run_data["name"] == expected_run.name
    assert last_run_data["settings_snapshot"] == expected_run.settings_snapshot
    # Compare timestamps carefully, ensuring timezone awareness
    expected_created_at_utc = expected_run.created_at.astimezone(timezone.utc)
    response_created_at_utc = datetime.fromisoformat(last_run_data["created_at"]).astimezone(timezone.utc)
    
    # Allow for minor differences due to precision if converting, but should be very close
    assert abs((response_created_at_utc - expected_created_at_utc).total_seconds()) < 1

    # Validate against RunResponse schema if possible
    # validated_run = RunResponse(**last_run_data) # This would raise error if mismatch
    # assert validated_run.id == expected_run.id
    # assert validated_run.name == expected_run.name
    # assert validated_run.settings_snapshot == expected_run.settings_snapshot
    # assert validated_run.created_at.replace(tzinfo=None) == expected_run.created_at.replace(tzinfo=None) # Naive comparison if both naive
    # assert validated_run.copied_from == expected_run.copied_from
    pass # Basic checks above are sufficient for now.
