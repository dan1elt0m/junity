import os

from jupyter_server.utils import url_path_join

from junity.preview_handler import PreviewHandler
from junity.settings_handler import SettingsHandler


def setup_handlers(web_app):
    host_pattern = ".*$"

    base_url = web_app.settings["base_url"]
    # Prepend the base_url so that it works in a JupyterHub setting
    setting_pattern = url_path_join(base_url, "junity-server", "uc_settings")
    preview_pattern = url_path_join(base_url, "junity-server", "preview")

    handlers = [(setting_pattern, SettingsHandler), (preview_pattern, PreviewHandler)]
    web_app.add_handlers(host_pattern, handlers)
