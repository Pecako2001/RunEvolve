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
