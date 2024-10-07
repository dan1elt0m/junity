import json
import pytest


@pytest.mark.asyncio
async def test_get_hello(jp_fetch):
    # When
    response = await jp_fetch("junity-server", "hello")

    # Then
    assert response.code == 200
    payload = json.loads(response.body)
    assert payload == {
        "data": "This is /junity-server/hello endpoint!"
    }