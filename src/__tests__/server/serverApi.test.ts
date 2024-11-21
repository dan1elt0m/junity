// serverApi.test.ts
import { ServerConnection } from '@jupyterlab/services';
import { requestAPI } from '../../server/serverApi';

jest.mock('@jupyterlab/services', () => ({
  ServerConnection: {
    makeSettings: jest.fn(),
    makeRequest: jest.fn(),
    NetworkError: jest.fn().mockImplementation(() => {
      throw new Error('Network Error');
    }),
    ResponseError: jest.fn().mockImplementation(() => {
      throw new Error('Response Error');
    })
  },
  URLExt: {
    join: jest.fn((...args) => args.join('/'))
  }
}));

describe('requestAPI', () => {
  const mockSettings = { baseUrl: 'http://localhost:8888/' };
  const mockResponse = (ok: boolean, data: string) => ({
    ok,
    text: jest.fn().mockResolvedValue(data)
  });

  beforeEach(() => {
    (ServerConnection.makeSettings as jest.Mock).mockReturnValue(mockSettings);
  });

  it('should make a successful request and return JSON data', async () => {
    const data = { key: 'value' };
    (ServerConnection.makeRequest as jest.Mock).mockResolvedValue(
      mockResponse(true, JSON.stringify(data))
    );

    const result = await requestAPI('test-endpoint');

    expect(ServerConnection.makeSettings).toHaveBeenCalled();
    expect(ServerConnection.makeRequest).toHaveBeenCalledWith(
      'http://localhost:8888/junity-server/test-endpoint',
      {},
      mockSettings
    );
    expect(result).toEqual(data);
  });

  it('should handle non-JSON response', async () => {
    (ServerConnection.makeRequest as jest.Mock).mockResolvedValue(
      mockResponse(true, 'Not JSON')
    );

    const result = await requestAPI('test-endpoint');

    expect(result).toBeUndefined();
  });

  it('should handle empty response body', async () => {
    (ServerConnection.makeRequest as jest.Mock).mockResolvedValue(
      mockResponse(true, '')
    );

    const result = await requestAPI('test-endpoint');

    expect(result).toBeUndefined();
  });

  it('should throw a ResponseError for unsuccessful response', async () => {
    const errorResponse = mockResponse(false, 'Error');
    (ServerConnection.makeRequest as jest.Mock).mockResolvedValue(
      errorResponse
    );

    await expect(requestAPI('test-endpoint')).rejects.toThrow('Response Error');
  });

  it('should throw a NetworkError for network issues', async () => {
    const networkError = new Error('Network Error');
    (ServerConnection.makeRequest as jest.Mock).mockRejectedValue(networkError);

    await expect(requestAPI('test-endpoint')).rejects.toThrow('Network Error');
  });
});
