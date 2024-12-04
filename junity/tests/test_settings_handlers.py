import json
from unittest.mock import patch, MagicMock

import pytest
from junity.handlers import setup_handlers



@pytest.fixture
def jy_web_app(jp_web_app):
    setup_handlers(jp_web_app)


@patch("junity.settings_handler.Config")
def test_get_settings(patched_config: MagicMock, jy_web_app, jp_asyncio_loop, jp_fetch):
    class MockConfig:
        AWS_REGION = "eu-west-1"
        HOST_URL = "http://localhost:8888"
        ACCESS_TOKEN = "test-access"
        GOOGLE_AUTH_ENABLED = True
        GOOGLE_CLIENT_ID = "test-client-id"

    patched_config.return_value = MockConfig()


    # When
    response = jp_asyncio_loop.run_until_complete(jp_fetch("junity-server", "uc_settings"))

    # Then
    assert response.code == 200
    payload = json.loads(response.body)
    assert payload["data"]["hostUrl"] == "http://localhost:8888"
    assert payload["data"]["accessToken"] == "test-access"
    assert payload["data"]["googleAuthEnabled"] is True
    assert payload["data"]["googleClientId"] == "test-client-id"


@patch("junity.settings_handler.Config")
def test_get_settings_empty(patched_config: MagicMock, jy_web_app, jp_asyncio_loop, jp_fetch):
    class MockConfig:
        AWS_REGION = "eu-west-1"
        HOST_URL = "http://localhost:8888"
        ACCESS_TOKEN = "test-access"
        GOOGLE_AUTH_ENABLED = None
        GOOGLE_CLIENT_ID = "test-client-id"

    patched_config.return_value = MockConfig()


    # When
    response = jp_asyncio_loop.run_until_complete(jp_fetch("junity-server", "uc_settings"))

    # Then
    assert response.code == 200
    payload = json.loads(response.body)
    assert payload["data"]["hostUrl"] == "http://localhost:8888"
    assert payload["data"]["accessToken"] == "test-access"
    assert payload["data"]["googleAuthEnabled"] is None
    assert payload["data"]["googleClientId"] == "test-client-id"

