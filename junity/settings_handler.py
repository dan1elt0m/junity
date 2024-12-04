import json

import tornado
from jupyter_server.base.handlers import APIHandler

from junity.config import Config


class SettingsHandler(APIHandler):
    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server
    @tornado.web.authenticated
    def get(self):
        config = Config()
        self.finish(json.dumps({
            "data": {
                "hostUrl": config.HOST_URL,
                "accessToken": config.ACCESS_TOKEN,
                "googleAuthEnabled": config.GOOGLE_AUTH_ENABLED,
                "googleClientId": config.GOOGLE_CLIENT_ID,
            }
        }))
