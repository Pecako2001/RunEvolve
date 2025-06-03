import pytest
from httpx import AsyncClient
from app.routers import strava as strava_router

@pytest.mark.asyncio
async def test_zones_cached(async_client: AsyncClient, test_user, monkeypatch):
    data = {"username": test_user.email, "password": "admin"}
    token_resp = await async_client.post("/auth/token", data=data)
    token = token_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    calls = {"count": 0}

    def fake_fetch(token):
        calls["count"] += 1
        return {"zones": "live"}

    monkeypatch.setattr(strava_router, "fetch_athlete_zones", fake_fetch)

    resp1 = await async_client.get("/strava/athlete/zones", headers=headers)
    assert resp1.status_code == 200
    assert resp1.json() == {"zones": "live"}
    assert calls["count"] == 1

    def fail_fetch(token):
        raise RuntimeError("should not fetch again")

    monkeypatch.setattr(strava_router, "fetch_athlete_zones", fail_fetch)

    resp2 = await async_client.get("/strava/athlete/zones", headers=headers)
    assert resp2.status_code == 200
    assert resp2.json() == {"zones": "live"}
    assert calls["count"] == 1


@pytest.mark.asyncio
async def test_stats_cached(async_client: AsyncClient, test_user, monkeypatch):
    data = {"username": test_user.email, "password": "admin"}
    token_resp = await async_client.post("/auth/token", data=data)
    token = token_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    calls = {"count": 0}

    def fake_fetch(token, athlete_id):
        calls["count"] += 1
        return {"stats": "live"}

    monkeypatch.setattr(strava_router, "fetch_athlete_stats", fake_fetch)

    resp1 = await async_client.get("/strava/athlete/stats", headers=headers)
    assert resp1.status_code == 200
    assert resp1.json() == {"stats": "live"}
    assert calls["count"] == 1

    def fail_fetch(token, athlete_id):
        raise RuntimeError("should not fetch again")

    monkeypatch.setattr(strava_router, "fetch_athlete_stats", fail_fetch)

    resp2 = await async_client.get("/strava/athlete/stats", headers=headers)
    assert resp2.status_code == 200
    assert resp2.json() == {"stats": "live"}
    assert calls["count"] == 1


@pytest.mark.asyncio
async def test_activities_cached(async_client: AsyncClient, test_user, monkeypatch):
    data = {"username": test_user.email, "password": "admin"}
    token_resp = await async_client.post("/auth/token", data=data)
    token = token_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    calls = {"count": 0}

    def fake_fetch(token, page=1, per_page=30):
        calls["count"] += 1
        return ["activity"]

    monkeypatch.setattr(strava_router, "fetch_athlete_activities", fake_fetch)

    resp1 = await async_client.get("/strava/athlete/activities", headers=headers)
    assert resp1.status_code == 200
    assert resp1.json() == ["activity"]
    assert calls["count"] == 1

    def fail_fetch(token, page=1, per_page=30):
        raise RuntimeError("should not fetch again")

    monkeypatch.setattr(strava_router, "fetch_athlete_activities", fail_fetch)

    resp2 = await async_client.get("/strava/athlete/activities", headers=headers)
    assert resp2.status_code == 200
    assert resp2.json() == ["activity"]
    assert calls["count"] == 1

