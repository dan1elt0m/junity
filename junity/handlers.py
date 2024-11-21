import os
import json

from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join
import tornado
from tornado.web import StaticFileHandler


def str_to_bool(value: str) -> bool:
    if value:
        return value.lower() in ('true', '1', 't', 'y', 'yes')


class SettingsHandler(APIHandler):
    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server
    @tornado.web.authenticated
    def get(self):
        host_url = os.environ.get("JY_HOST_URL")
        access_token = os.environ.get("JY_ACCESS_TOKEN")
        google_auth_enabled = str_to_bool(os.environ.get("JY_GOOGLE_AUTH_ENABLED"))
        google_client_id = os.environ.get("JY_GOOGLE_CLIENT_ID")
        self.finish(json.dumps({
            "data": {
                "hostUrl": host_url,
                "accessToken": access_token,
                "googleAuthEnabled": google_auth_enabled,
                "googleClientId": google_client_id,
            }
        }))

    @tornado.web.authenticated
    def post(self):
        # input_data is a dictionary with a key "name"
        input_data = self.get_json_body()
        name = input_data.get("name")
        host_url = os.environ.get("JY_HOST_URL")
        data = {"greetings": f"Hello {name}, enjoy JupyterLab!",
                "Host URL": f"{host_url}"}
        self.finish(json.dumps(data))


def setup_handlers(web_app):
    host_pattern = ".*$"

    base_url = web_app.settings["base_url"]
    # Prepend the base_url so that it works in a JupyterHub setting
    setting_pattern = url_path_join(base_url, "junity-server", "uc_settings")
    handlers = [(setting_pattern, SettingsHandler)]
    web_app.add_handlers(host_pattern, handlers)

    # Prepend the base_url so that it works in a JupyterHub setting
    doc_url = url_path_join(base_url, "junity-server", "public")
    doc_dir = os.getenv(
        "JLAB_SERVER_EXAMPLE_STATIC_DIR",
        os.path.join(os.path.dirname(__file__), "public"),
    )
    handlers = [("{}/(.*)".format(doc_url), StaticFileHandler, {"path": doc_dir})]
    web_app.add_handlers(host_pattern, handlers)