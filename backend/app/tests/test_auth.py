import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_login_success(async_client: AsyncClient):
    data = {"username": "admin", "password": "admin"}
    response = await async_client.post("/auth/token", data=data)
    assert response.status_code == 200
    json = response.json()
    assert "access_token" in json
    token = json["access_token"]

    me = await async_client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me.status_code == 200
    assert me.json()["username"] == "admin"

@pytest.mark.asyncio
async def test_login_failure(async_client: AsyncClient):
    response = await async_client.post("/auth/token", data={"username": "bad", "password": "bad"})
    assert response.status_code == 401
