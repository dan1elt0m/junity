import { ILabShell, JupyterFrontEnd } from '@jupyterlab/application';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { INotebookTracker } from '@jupyterlab/notebook';
import junity from '../index';
import { JupyterServer } from '@jupyterlab/testing';
import { requestAPI } from '../server/serverApi';
import { loadSettingEnv } from '../utils/settings';
// Add this at the top of your test file or in a setup file

// Mock the requestAPI function
jest.mock('../server/serverApi', () => ({
  requestAPI: jest.fn()
}));

// Mock the fetchCatalogs function, so no actual API calls are made to UC cat
jest.mock('../hooks/catalog', () => ({
  useListCatalogs: jest.fn().mockResolvedValue([])
}));

const mockSettings = {
  load: jest.fn().mockResolvedValue({
    composite: {
      hostUrl: 'http://example.com/setting',
      token: 'example-token-setting'
    },
    get: jest.fn((key: string) => {
      if (key === 'hostUrl') {
        return { composite: 'http://example.com/setting' };
      }
      if (key === 'unityCatalogToken') {
        return { composite: 'example-token-setting' };
      }
      return { composite: '' };
    }),
    set: jest.fn(),
    changed: { connect: jest.fn() }
  }),
  set: jest.fn(),
  get: jest.fn().mockReturnValue({ composite: '' }),
  changed: { connect: jest.fn() }
} as unknown as ISettingRegistry;

describe('Junity extension', () => {
  let app: JupyterFrontEnd;
  let shell: ILabShell;
  let notebookTracker: INotebookTracker;
  let server: JupyterServer;

  const envHostUrl = 'http://example.com';
  const envToken = 'example-token';
  const originalEnv = process.env;

  async function startJupyterServerWithRetry(
    retries = 5,
    delay = 1000
  ): Promise<JupyterServer> {
    let server: JupyterServer;
    for (let i = 0; i < retries; i++) {
      try {
        server = new JupyterServer();
        await server.start();
        return server;
      } catch (error) {
        if (i === retries - 1) {
          throw error;
        }
        console.warn(
          `Retrying to start Jupyter server (${i + 1}/${retries})...`
        );
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw new Error('Failed to start Jupyter server after multiple attempts');
  }

  beforeAll(async () => {
    jest.setTimeout(20000); // Increase the timeout for the beforeAll hook
    server = await startJupyterServerWithRetry();
  });

  afterAll(async () => {
    try {
      await server.shutdown();
    } catch (error) {
      console.error('Failed to shut down Jupyter server:', error);
    }
  });

  beforeEach(async () => {
    jest.setTimeout(20000); // Increase the timeout for the beforeEach hook
    jest.resetModules();
    jest.clearAllMocks();

    // Replace the original CatalogTreeWidget with the mock class
    jest.mock('../index', () => {
      const originalModule = jest.requireActual('../index');
      return {
        ...originalModule,
        CatalogTreeWidget: jest.fn().mockImplementation(() => ({
          updateHostUrl: jest.fn(),
          updateToken: jest.fn()
        }))
      };
    });

    // Mock the ServerConnection.makeRequest function
    jest.mock('@jupyterlab/application', () => ({
      JupyterFrontEndPlugin: jest.fn(),
      ILabShell: jest.fn(),
      ServerConnection: {
        makeRequest: jest.fn().mockResolvedValue({
          ok: true,
          json: jest.fn().mockResolvedValue({})
        })
      }
    }));

    process.env = { ...originalEnv }; // Clone the original environment

    shell = {
      add: jest.fn()
    } as unknown as ILabShell;

    app = {
      restored: Promise.resolve(),
      commands: {
        addCommand: jest.fn()
      }
    } as unknown as JupyterFrontEnd;

    notebookTracker = {} as INotebookTracker;

    // Mock the requestAPI response
    (requestAPI as jest.Mock).mockResolvedValue({
      data: {
        hostUrl: envHostUrl,
        token: envToken
      }
    });
  });

  afterEach(async () => {
    process.env = originalEnv; // Restore the original environment
    jest.clearAllMocks();
  });

  test('Activates without crashing', async () => {
    await junity.activate(app, shell, notebookTracker, mockSettings);
    expect(mockSettings.load).toHaveBeenCalledWith('junity:settings');
  });

  test('Should use default settings if no env vars are set', async () => {
    await junity.activate(app, shell, notebookTracker, mockSettings);
    expect(mockSettings.set).toHaveBeenCalledTimes(0);
  });

  test('Should update settings if env vars are set', async () => {
    process.env.UC_HOST_URL = 'http://example.com';
    const setting = await mockSettings.load('junity:settings');
    await loadSettingEnv(setting);
    expect(setting.set).toHaveBeenCalledTimes(1);
    expect(setting.set).toHaveBeenCalledWith('hostUrl', 'http://example.com');
  });
});
