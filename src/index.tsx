import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILabShell
} from '@jupyterlab/application';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { requestAPI } from './handler';

import { ReactWidget } from '@jupyterlab/ui-components';
import { INotebookTracker } from '@jupyterlab/notebook';
import CatalogTree from './catalogTree';
import * as React from 'react';
import '../style/index.css'; // Import the CSS file

import { ICommandPalette, IFrame } from '@jupyterlab/apputils';

import { PageConfig } from '@jupyterlab/coreutils';

import { ILauncher } from '@jupyterlab/launcher';

/**
 * The command IDs used by the server extension plugin.
 */
namespace CommandIDs {
  export const get = 'server:get-file';
}

const PLUGIN_ID = 'junity:settings';

/**
 * A widget to display the catalog tree.
 */
class CatalogTreeWidget extends ReactWidget {
  private notebookTracker: INotebookTracker;
  private hostUrl: string;
  private token: string;

  constructor(
    notebookTracker: INotebookTracker,
    hostUrl: string,
    token: string
  ) {
    super();
    this.notebookTracker = notebookTracker;
    this.hostUrl = hostUrl;
    this.token = token;
    this.id = 'catalog-tree-widget';
    this.title.closable = true;
    this.addClass('jp-CatalogTreeWidget');
  }
  updateHostUrl(hostUrl: string) {
    this.hostUrl = hostUrl;
    this.update();
  }
  updateToken(token: string) {
    this.token = token;
    this.update();
  }
  render() {
    return (
      <CatalogTree
        notebookTracker={this.notebookTracker}
        hostUrl={this.hostUrl}
        token={this.token}
      />
    );
  }
}

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
 * Initialization data for the jupyterlab-sidepanel extension.

 */
const extension: JupyterFrontEndPlugin<void> = {
  id: PLUGIN_ID,
  autoStart: true,
  requires: [ILabShell, INotebookTracker, ISettingRegistry, ICommandPalette],
  activate: (
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

    let hostUrl = 'http://localhost:8080/api/2.1/unity-catalog';
    let token = 'not-used';

    // Test the server extension
    requestAPI<any>('hello')
      .then(data => {
        console.log(data);
      })
      .catch(reason => {
        console.error(
          `The junity server extension appears to be missing.\n${reason}`
        );
      });

    // POST request
    const dataToSend = { name: 'Daniel' };
    requestAPI<any>('hello', {
      body: JSON.stringify(dataToSend),
      method: 'POST'
    })
      .then(reply => {
        console.log(reply);
      })
      .catch(reason => {
        console.error(
          `Error on POST /junity-server/hello ${dataToSend}.\n${reason}`
        );
      });

    function loadSetting(setting: ISettingRegistry.ISettings): void {
      const envHostUrl = process.env.UC_HOST_URL;
      const envToken = process.env.UC_TOKEN;

      hostUrl =
        envHostUrl || (setting.get('unityCatalogHostUrl').composite as string);
      token =
        envToken || (setting.get('unityCatalogToken').composite as string);
      // Update the settings to reflect the environment variables if they are set
      if (envHostUrl) {
        console.log('Found UC_HOST_URL environment variable');
        console.log('Updating host URL settings');
        setting.set('unityCatalogHostUrl', envHostUrl);
      }
      if (envToken) {
        console.log('Found UC_TOKEN environment variable');
        console.log('Updating token settings');
        setting.set('unityCatalogToken', envToken);
      }

      catalogTreeWidget.updateHostUrl(hostUrl);
      catalogTreeWidget.updateToken(token);
      console.log(`Unity Catalog Host URL is set to '${hostUrl}'`);
    }

    // Wait for the application to be restored and
    // for the settings for this plugin to be loaded
    Promise.all([app.restored, settings.load(PLUGIN_ID)]).then(
      ([, setting]) => {
        // Read the settings
        loadSetting(setting);

        // Listen for your plugin setting changes using Signal
        setting.changed.connect(loadSetting);
      }
    );

    const catalogTreeWidget = new CatalogTreeWidget(
      notebookTracker,
      hostUrl,
      token
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

export default extension;
