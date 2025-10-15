Archived

![Junity Logo](style/logo/junity.png)

[![Github Actions Status](https://github.com/dan1elt0m/junity/workflows/Build/badge.svg)](https://github.com/dan1elt0m/junity/actions/workflows/build.yml)

A OSS Unity Catalog extension for Jupyter Lab. This extension allows you to browse and manage the Unity Catalog.

![Junity Demo](docs/demo.gif)

## Features

- Browse and manage the Unity Catalog in JupyterLab
- SidePanel Catalog Tree with option to insert names into code cells
- Preview table data
- Oauth with Google and token based authentication
- Easy configuration with JupyterLab settings editor
- Docker example with JupyterLab, Unity Catalog and DuckDB

## Requirements

- JupyterLab >= 4.0.0

## Install

To install the extension, execute:

```bash
pip install junity
```

## Uninstall

To remove the extension, execute:

```bash
pip uninstall junity
```

Or use the [JupyterLab extension manager](https://jupyterlab.readthedocs.io/en/stable/user/extensions.html#).

## Configuration

For configuration, you can use the JupyterLab settings editor or set Environmental variables.

Possible editor / env settings are:

- `hostUrl / JY_HOST_URL`: The URL of the Unity Catalog server. Default is `http://localhost:8080`.
- `accessToken / JY_ACCESS_TOKEN`: The token to authenticate with the Unity Catalog server. Default is `None`.
- `googleAuthEnabled / JY_GOOGLE_AUTH_ENABLED`: Enable or disable authentication. Default is `False`. If enabled, the `googleClientId` setting is required. In addition, the UC server must be configured to accept Google authentication and user must exist in the UC server.
- `googleClientId / JY_GOOGLE_CLIENT_ID`: The Google client ID for authentication. Default is `None`.

These settings can be configured partially in editor and partially in env variables. The env variables overwrite
editor settings. Env vars are only processed on startup, but editor settings can be changed at runtime.

Specific settings for data preview:

- `JY_AWS_REGION`: Required if data is stored on AWS. Default is `eu-west-1`
- `JY_DOCKER_HOST`: Required if both JupyterLab and Unity Catalog are running in Docker.

## Example

To run the example, navigate to the `/docker` directory and execute the following command:

```bash
docker compose up --build -d
```

After starting the Docker containers, you can access the Jupyter notebooks at http://localhost:8888/lab?token=junity.
The example notebook demonstrates how to use Junity, and DuckDB with Unity Catalog for data management and querying.

You can reach the Unity Catalog at http://localhost:8080/api/2.1/unity-catalog.

## Debugging

You can watch the Jupyter lab console output for logs/errors.
Possible errors:

- `Failed to fetch`: The server is not reachable. Check the `hostUrl` setting.
- `Authentication failed`: The authentication failed. Check the `accessToken` or `googleAuth` settings. Try logging in again.
- `Invalid token`: The token is invalid. Tokens are valid for 1 hour. You can get a new token by logging in again.
- `Cross Origin Request Blocked`: The UC server does not allow traffic from the JupyterLab server.
  Add the JupyterLab server to the CORS settings in the UC server.

````bash


## Docker Example

In the `docker` folder, you can find an example of how to run JupyterLab and Unity Catalog in Docker containers.
To run the example, execute:

```bash
docker compose up --build -d
````

This will start JupyterLab on `http://localhost:8888` and Unity Catalog on `http://localhost:8080/api/2.1/unity-catalog`.
You can access the example notebook by opening this URL in your browser: `http://localhost:8888/lab?token=junity/tree/example.ipynb`

## Contributing

### Development install

Note: You will need NodeJS to build the extension package.

The `jlpm` command is JupyterLab's pinned version of
[yarn](https://yarnpkg.com/) that is installed with JupyterLab. You may use
`yarn` or `npm` in lieu of `jlpm` below.

```bash
# Clone the repo to your local environment
# Change directory to the junity directory
# Install package in development mode
pip install -e "."
# Link your development version of the extension with JupyterLab
jupyter labextension develop . --overwrite
# Rebuild extension Typescript source after making changes
jlpm build
```

You can watch the source directory and run JupyterLab at the same time in different terminals to watch for changes in the extension's source and automatically rebuild the extension.

```bash
# Watch the source directory in one terminal, automatically rebuilding when needed
jlpm watch
# Run JupyterLab in another terminal
jupyter lab
```

With the watch command running, every saved change will immediately be built locally and available in your running JupyterLab. Refresh JupyterLab to load the change in your browser (you may need to wait several seconds for the extension to be rebuilt).

By default, the `jlpm build` command generates the source maps for this extension to make it easier to debug using the browser dev tools. To also generate source maps for the JupyterLab core extensions, you can run the following command:

```bash
jupyter lab build --minimize=False
```

### Development uninstall

```bash
pip uninstall junity
```

In development mode, you will also need to remove the symlink created by `jupyter labextension develop`
command. To find its location, you can run `jupyter labextension list` to figure out where the `labextensions`
folder is located. Then you can remove the symlink named `junity` within that folder.

### Testing the extension

#### Frontend tests

This extension is using [Jest](https://jestjs.io/) for JavaScript code testing.

To execute them, execute:

```sh
jlpm
jlpm test
```

## Linting and prettier

```sh
jlpm lint
jlpm prettier
```

#### Integration tests

This extension uses [Playwright](https://playwright.dev/docs/intro) for the integration tests (aka user level tests).
More precisely, the JupyterLab helper [Galata](https://github.com/jupyterlab/jupyterlab/tree/master/galata) is used to handle testing the extension in JupyterLab.

More information are provided within the [ui-tests](./ui-tests/README.md) README.

### Packaging the extension

See [RELEASE](RELEASE.md)

#### Remarks

Also checkout my other library [dunky](https://github.com/dan1elt0m/dunky) for a matching jupyter kernel
