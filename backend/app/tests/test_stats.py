import pytest
from httpx import AsyncClient
from datetime import datetime

from app.models import Run, RunStatus
from app.database import SessionLocal

@pytest.mark.asyncio
async def test_stats_totals(async_client: AsyncClient, db_session: SessionLocal):
    runs = [
        (datetime(2023, 12, 31, 10, 0, 0), 5.0),
        (datetime(2024, 1, 1, 10, 0, 0), 8.0),
        (datetime(2024, 1, 2, 10, 0, 0), 7.0),
        (datetime(2024, 2, 1, 10, 0, 0), 3.0),
    ]
    for dt, dist in runs:
        db_session.add(
            Run(
                name="Seeded Run",
                created_at=dt,
                distance=dist,
                time=1000,
                average_speed=8.0,
                status=RunStatus.COMPLETED,
                settings_snapshot={},
            )
        )
    db_session.commit()

    response = await async_client.get("/runs/stats")
    assert response.status_code == 200
    stats = response.json()

    assert stats["weekly"]["2023-W52"] == {"count": 1, "total_distance": 5.0}
    assert stats["weekly"]["2024-W01"] == {"count": 2, "total_distance": 15.0}
    assert stats["weekly"]["2024-W05"] == {"count": 1, "total_distance": 3.0}

    assert stats["monthly"]["2023-12"] == {"count": 1, "total_distance": 5.0}
    assert stats["monthly"]["2024-01"] == {"count": 2, "total_distance": 15.0}
    assert stats["monthly"]["2024-02"] == {"count": 1, "total_distance": 3.0}

    assert stats["yearly"]["2023"] == {"count": 1, "total_distance": 5.0}
    assert stats["yearly"]["2024"] == {"count": 3, "total_distance": 18.0}
