import {
  ILabShell,
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { INotebookTracker } from '@jupyterlab/notebook';
import '../style/index.css'; // Import the CSS file
import { CatalogTreeWidget } from './widgets/catalogTreeWidget';
import { loadSettingEnv } from './utils/settings';

/**
 * The command IDs used by the server extension plugin.
 */

const PLUGIN_ID = 'junity:settings';

/**
 * Initialization of the junity extension.
 */
const junity: JupyterFrontEndPlugin<void> = {
  id: PLUGIN_ID,
  autoStart: true,
  requires: [ILabShell, INotebookTracker, ISettingRegistry],
  activate: async (
    app: JupyterFrontEnd,
    shell: ILabShell,
    notebookTracker: INotebookTracker,
    settings: ISettingRegistry
  ) => {
    /**
     * Load the settings for this extension
     *
     * @param setting Extension settings
     */
    console.log('Activating JupyterLab extension junity');
    let catalogHostUrl: string = '';
    let accessToken: string = '';
    let googleAuthEnabled = false;
    let googleClientId: string = '';

    // Load the settings for this extension
    async function loadSettingPlugin(
      setting: ISettingRegistry.ISettings
    ): Promise<void> {
      catalogHostUrl = setting.get('hostUrl').composite as string;
      catalogTreeWidget.updateHostUrl(catalogHostUrl);

      accessToken = setting.get('accessToken').composite as string;
      catalogTreeWidget.updateToken(accessToken);

      googleAuthEnabled = setting.get('googleAuthEnabled').composite as boolean;
      catalogTreeWidget.updateAuthenticationEnabled(googleAuthEnabled);

      googleClientId = setting.get('googleClientId').composite as string;
      catalogTreeWidget.updateGoogleClientId(googleClientId);
    }

    // Wait for the application to be restored and
    // for the settings for this plugin to be loaded
    Promise.all([app.restored, settings.load(PLUGIN_ID)]).then(
      ([, setting]) => {
        // Read the settings from env variable, only on start up
        loadSettingEnv(setting);
        // Read the settings
        loadSettingPlugin(setting);
        // Listen for your plugin setting changes using Signal
        setting.changed.connect(loadSettingPlugin);
      }
    );

    const catalogTreeWidget = new CatalogTreeWidget(
      notebookTracker,
      catalogHostUrl,
      accessToken,
      googleAuthEnabled,
      googleClientId
    );
    catalogTreeWidget.title.label = 'Catalog';
    catalogTreeWidget.title.iconClass = 'jp-icon-extension jp-SideBar-tabIcon';
    shell.add(catalogTreeWidget, 'left');

    console.log('JupyterLab extension junity is activated!');
  }
};

export default junity;
export const activate = junity.activate;
