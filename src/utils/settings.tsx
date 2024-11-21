import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { requestAPI } from '../server/serverApi';

interface SettingsData {
  data: {
    hostUrl: string;
    accessToken: string;
    googleAuthEnabled: boolean;
    googleClientId: string;
  };
}

// Load the settings for this extension
export async function loadSettingEnv(
  setting: ISettingRegistry.ISettings
): Promise<void> {
  console.log('Loading Env Settings');

  const settingsData = await requestAPI<SettingsData>('uc_settings');
  if (!settingsData) {
    console.log('No Env variable settings found');
    return;
  }
  const {
    data: {
      hostUrl: catalogHostUrl,
      accessToken: accessToken,
      googleAuthEnabled: googleAuthEnabled,
      googleClientId: googleClientId
    }
  } = settingsData;
  if (catalogHostUrl) {
    console.log('Found JY_HOST_URL environment variable');
    console.log('Updating host URL settings: ', catalogHostUrl);
    setting.set('hostUrl', catalogHostUrl);
  }
  if (accessToken) {
    console.log('Found JY_ACCESS_TOKEN environment variable');
    console.log('Updating access token settings');
    setting.set('accessToken', accessToken);
  }
  if (googleAuthEnabled != null) {
    console.log('Found JY_GOOGLE_AUTH_ENABLED environment variable');
    console.log('Updating google auth settings');
    console.log('googleAuthEnabled: ', googleAuthEnabled);
    setting.set('googleAuthEnabled', googleAuthEnabled);
  }
  if (googleClientId) {
    console.log('Found JY_GOOGLE_CLIENT_ID environment variable');
    console.log('Updating google client id settings');
    setting.set('googleClientId', googleClientId);
  }
}
