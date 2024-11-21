// settings.test.ts
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { loadSettingEnv } from '../../utils/settings';
import { requestAPI } from '../../server/serverApi';

jest.mock('../../server/serverApi');

describe('loadSettingEnv', () => {
  let mockSetting: ISettingRegistry.ISettings;

  beforeEach(() => {
    mockSetting = {
      set: jest.fn()
    } as unknown as ISettingRegistry.ISettings;
  });

  it('should load settings and update them correctly', async () => {
    (requestAPI as jest.Mock).mockResolvedValue({
      data: {
        hostUrl: 'http://example.com',
        googleAuthEnabled: true,
        googleClientId: 'test-client-id'
      }
    });

    await loadSettingEnv(mockSetting);

    expect(requestAPI).toHaveBeenCalledWith('uc_settings');
    expect(mockSetting.set).toHaveBeenCalledWith(
      'hostUrl',
      'http://example.com'
    );
    expect(mockSetting.set).toHaveBeenCalledWith('googleAuthEnabled', true);
    expect(mockSetting.set).toHaveBeenCalledWith(
      'googleClientId',
      'test-client-id'
    );
  });

  it('should handle missing settings data', async () => {
    (requestAPI as jest.Mock).mockResolvedValue(null);

    await loadSettingEnv(mockSetting);

    expect(requestAPI).toHaveBeenCalledWith('uc_settings');
    expect(mockSetting.set).not.toHaveBeenCalled();
  });

  it('should handle partial settings data', async () => {
    (requestAPI as jest.Mock).mockResolvedValue({
      data: {
        hostUrl: 'http://example.com',
        googleAuthEnabled: false,
        googleClientId: ''
      }
    });

    await loadSettingEnv(mockSetting);

    expect(requestAPI).toHaveBeenCalledWith('uc_settings');
    expect(mockSetting.set).toHaveBeenCalledWith(
      'hostUrl',
      'http://example.com'
    );
    expect(mockSetting.set).toHaveBeenCalledWith('googleAuthEnabled', false);
    expect(mockSetting.set).not.toHaveBeenCalledWith(
      'googleClientId',
      expect.anything()
    );
  });
});
