import json
import pytest
from unittest.mock import patch

from junity.handlers import setup_handlers

@pytest.fixture
def jy_web_app(jp_web_app):
    setup_handlers(jp_web_app)

@patch('junity.preview_handler.PreviewHandler.get')
def test_get_preview(mock_preview, jy_web_app, jp_asyncio_loop, jp_fetch):
    mock_preview.return_value = [
        {"column1": "value1", "column2": "value2"}
    ]

    # When
    response = jp_asyncio_loop.run_until_complete(
        jp_fetch("junity-server", "preview", params={"table_name": "my_table",
                                                     "access_token": "test-token",
                                                     "api_endpoint": "test-endpoint",
                                                     "aws_region": "test-region"})
    )

    # Then
    assert response.code == 200
    payload = json.loads(response.body)
    assert payload["data"] == [
        {"column1": "value1", "column2": "value2"}
    ]

@patch('junity.preview_handler.PreviewHandler.get')
def test_get_preview_empty(mock_preview, jy_web_app, jp_asyncio_loop, jp_fetch):
    mock_preview.return_value = []

    # When
    response = jp_asyncio_loop.run_until_complete(
        jp_fetch("junity-server", "preview", params={"table_name": "my_table",
                                                     "access_token": "test-token",
                                                     "api_endpoint": "test-endpoint",
                                                     "aws_region": "test-region"})
    )

    # Then
    assert response.code == 200
    payload = json.loads(response.body)
    assert payload["data"] == []