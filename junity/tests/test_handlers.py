import os
import json
import pytest

from junity.handlers import setup_handlers

@pytest.fixture
def jy_web_app(jp_web_app):
    setup_handlers(jp_web_app)


def test_get_settings(jy_web_app, jp_asyncio_loop, jp_fetch):
    os.environ["JY_HOST_URL"] = "http://localhost:8888"
    os.environ["JY_ACCESS_TOKEN"] = "test-access"
    os.environ["JY_GOOGLE_AUTH_ENABLED"] = "true"
    os.environ["JY_GOOGLE_CLIENT_ID"] = "test-client-id"

    # When
    response = jp_asyncio_loop.run_until_complete(jp_fetch("junity-server", "uc_settings"))

    # Then
    assert response.code == 200
    payload = json.loads(response.body)
    assert payload["data"]["hostUrl"] == "http://localhost:8888"
    assert payload["data"]["accessToken"] == "test-access"
    assert payload["data"]["googleAuthEnabled"] is True
    assert payload["data"]["googleClientId"] == "test-client-id"


def test_post_settings(jy_web_app,jp_asyncio_loop,  jp_fetch):
    # Set environment variables
    os.environ["JY_HOST_URL"] = "http://localhost:8888"

    # When
    response = jp_asyncio_loop.run_until_complete(
        jp_fetch("junity-server", "uc_settings", method="POST", body=json.dumps({"name": "Test User"}))
    )

    # Then
    assert response.code == 200
    payload = json.loads(response.body)
    assert payload["greetings"] == "Hello Test User, enjoy JupyterLab!"
    assert payload["Host URL"] == "http://localhost:8888"


def test_get_settings_empty(jy_web_app, jp_asyncio_loop, jp_fetch):
    os.environ["JY_HOST_URL"] = "http://localhost:8888"
    os.environ["JY_ACCESS_TOKEN"] = "test-access"
    os.environ["JY_GOOGLE_AUTH_ENABLED"] = ""
    os.environ["JY_GOOGLE_CLIENT_ID"] = "test-client-id"

    # When
    response = jp_asyncio_loop.run_until_complete(jp_fetch("junity-server", "uc_settings"))

    # Then
    assert response.code == 200
    payload = json.loads(response.body)
    assert payload["data"]["hostUrl"] == "http://localhost:8888"
    assert payload["data"]["accessToken"] == "test-access"
    assert payload["data"]["googleAuthEnabled"] is None
    assert payload["data"]["googleClientId"] == "test-client-id"

