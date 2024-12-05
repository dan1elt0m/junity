import json

import duckdb
import os

import tornado
from jupyter_server.base.handlers import APIHandler

class PreviewHandler(APIHandler):
    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server
    @tornado.web.authenticated
    def get(self):
        table_name = self.get_argument("table_name")
        access_token = self.get_argument("access_token")
        api_endpoint = self.get_argument("api_endpoint")
        aws_region = os.environ.get("JY_AWS_REGION", "eu-west-1")
        docker_host = os.environ.get("JY_DOCKER_HOST")

        if docker_host:
            api_endpoint = docker_host

        [catalog_name, _, _] = table_name.split(".")

        with duckdb.connect(":memory:") as conn:
            conn.sql(f"""
                    INSTALL uc_catalog from core_nightly;
                    INSTALL delta from core;
                    LOAD delta;
                    LOAD uc_catalog;
                    CREATE SECRET (
                        TYPE UC,
                        TOKEN '{access_token}',
                        ENDPOINT '{api_endpoint}',
                        AWS_REGION '{aws_region}' 
                    );
                    ATTACH '{catalog_name}' AS {catalog_name} (TYPE UC_CATALOG);
                    """)

            data = conn.execute(f"SELECT * FROM {table_name} LIMIT 500;").fetchdf().to_json(orient="records")

        self.finish({
            "data" : data
        })
