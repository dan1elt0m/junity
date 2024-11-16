import { URLExt } from '@jupyterlab/coreutils';

import { ServerConnection } from '@jupyterlab/services';

/**
 * Call the API extension
 *
 * @param endPoint API REST end point for the extension
 * @param init Initial values for the request
 * @returns The response body interpreted as JSON
 */
export async function requestAPI<T>(
  endPoint = '',
  init: RequestInit = {}
): Promise<T | undefined> {
  // Make request to Jupyter API
  const settings = ServerConnection.makeSettings();
  const requestUrl = URLExt.join(
    settings.baseUrl,
    'junity-server', // API Namespace
    endPoint
  );

  let response: Response;
  try {
    response = await ServerConnection.makeRequest(requestUrl, init, settings);
  } catch (error) {
    throw new ServerConnection.NetworkError(error as Error);
  }

  const data: string = await response.text();

  if (data.length > 0) {
    try {
      return JSON.parse(data);
    } catch {
      console.log('Not a JSON response body.', response);
    }
  } else {
    console.log('No data in response body');
  }

  if (!response.ok) {
    throw new ServerConnection.ResponseError(response, data);
  }

  return;
}
