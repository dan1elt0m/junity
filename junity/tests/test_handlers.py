import json
import pytest


@pytest.mark.asyncio
async def test_get_uc_settings(jp_fetch):
    # When
    response = await jp_fetch("junity-server", "uc_settings")

    # Then
    assert response.code == 200
    payload = json.loads(response.body)
    # Check that the response contains the expected keys
    assert payload["data"].keys() == {"hostUrl", "token"}
