import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_login_success(async_client: AsyncClient, test_user):
    data = {"username": test_user.email, "password": "admin"}
    response = await async_client.post("/auth/token", data=data)
    assert response.status_code == 200
    json = response.json()
    assert "access_token" in json
    token = json["access_token"]


@pytest.mark.asyncio
async def test_login_failure(async_client: AsyncClient, test_user):
    response = await async_client.post("/auth/token", data={"username": "bad", "password": "bad"})
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_login_callbacks(async_client: AsyncClient, test_user):
    from app.routers import auth

    events = {"success": 0, "failure": 0}

    def success_cb(user, db):
        events["success"] += 1

    def failure_cb(username, db):
        events["failure"] += 1

    # Register callbacks
    auth.register_login_success_callback(success_cb)
    auth.register_login_failure_callback(failure_cb)

    resp1 = await async_client.post(
        "/auth/token",
        data={"username": test_user.email, "password": "admin"},
    )
    assert resp1.status_code == 200

    resp2 = await async_client.post(
        "/auth/token",
        data={"username": "nope", "password": "wrong"},
    )
    assert resp2.status_code == 401

    assert events["success"] == 1
    assert events["failure"] == 1
