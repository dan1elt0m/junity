import { ILabShell, JupyterFrontEnd, JupyterFrontEndPlugin } from '@jupyterlab/application';
import { ISettingRegistry } from '@jupyterlab/settingregistry';

import { INotebookTracker } from '@jupyterlab/notebook';

import '../style/index.css'; // Import the CSS file
import { ICommandPalette, IFrame } from '@jupyterlab/apputils';

import { PageConfig } from '@jupyterlab/coreutils';

import { ILauncher } from '@jupyterlab/launcher';
import { CatalogTreeWidget } from './catalogTreeWidget';
import { loadSettingEnv } from './settings';

/**
 * The command IDs used by the server extension plugin.
 */
const CommandIDs = {
  get: 'server:get-file'
};

const PLUGIN_ID = 'junity:settings';


class IFrameWidget extends IFrame {
  constructor() {
    super();
    const baseUrl = PageConfig.getBaseUrl();
    this.url = baseUrl + 'junity-server/public/index.html';
    this.id = 'doc-example';
    this.title.label = 'Server Doc';
    this.title.closable = true;
    this.node.style.overflowY = 'auto';
    this.sandbox = ['allow-scripts'];
  }
}

/**
 * Initialization data for the junity jupyterlab-sidepanel extension.

 */
const junity: JupyterFrontEndPlugin<void> = {
  id: PLUGIN_ID,
  autoStart: true,
  requires: [ILabShell, INotebookTracker, ISettingRegistry, ICommandPalette],
  activate: async (
    app: JupyterFrontEnd,
    shell: ILabShell,
    notebookTracker: INotebookTracker,
    settings: ISettingRegistry,
    palette: ICommandPalette,
    launcher: ILauncher | null
  ) => {
    /**
     * Load the settings for this extension
     *
     * @param setting Extension settings
     */
    console.log('Activating JupyterLab extension junity');
    let catalogHostUrl: string = '';
    let authToken: string = '';
    let googleAuthEnabled = false;
    let googleClientId: string = '';

    // Load the settings for this extension
    async function loadSettingPlugin(
      setting: ISettingRegistry.ISettings
    ): Promise<void> {
      catalogHostUrl = setting.get('unityCatalogHostUrl').composite as string;
      catalogTreeWidget.updateHostUrl(catalogHostUrl);

      authToken = setting.get('unityCatalogToken').composite as string;
      catalogTreeWidget.updateToken(authToken);

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
      authToken,
      googleAuthEnabled,
      googleClientId,
      settings
    );
    catalogTreeWidget.title.label = 'Catalog';
    catalogTreeWidget.title.iconClass = 'jp-icon-extension jp-SideBar-tabIcon';
    shell.add(catalogTreeWidget, 'left');

    console.log('JupyterLab extension junity is activated!');

    const { commands } = app;
    const command = CommandIDs.get;
    const category = 'Extension Examples';

    commands.addCommand(command, {
      label: 'Get Server Content in a IFrame Widget',
      caption: 'Get Server Content in a IFrame Widget',
      execute: () => {
        const widget = new IFrameWidget();
        shell.add(widget, 'main');
      }
    });

    palette.addItem({ command, category: category });

    if (launcher) {
      // Add launcher
      launcher.add({
        command: command,
        category: category
      });
    }
  }
};

export default junity;
export const activate = junity.activate;
