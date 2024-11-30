import os

from junity.utils import str_to_bool


class Config:
    AWS_REGION = os.environ.get('JY_AWS_REGION', "eu-west-1")
    ACCESS_TOKEN = os.environ.get('JY_ACCESS_TOKEN')
    HOST_URL = os.environ.get("JY_HOST_URL")
    GOOGLE_AUTH_ENABLED = str_to_bool(os.environ.get("JY_GOOGLE_AUTH_ENABLED"))
    GOOGLE_CLIENT_ID = os.environ.get("JY_GOOGLE_CLIENT_ID")




