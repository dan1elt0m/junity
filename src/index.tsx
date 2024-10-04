import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILabShell
} from '@jupyterlab/application';
import { ISettingRegistry } from '@jupyterlab/settingregistry';

import { ReactWidget } from '@jupyterlab/ui-components';
import { INotebookTracker } from '@jupyterlab/notebook';
import CatalogTree from './catalogTree';
import * as React from 'react';
import '../style/index.css'; // Import the CSS file

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

/**
 * Initialization data for the jupyterlab-sidepanel extension.

 */
const extension: JupyterFrontEndPlugin<void> = {
  id: PLUGIN_ID,
  autoStart: true,
  requires: [ILabShell, INotebookTracker, ISettingRegistry],
  activate: (
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
    let hostUrl = 'http://localhost:8080/api/2.1/unity-catalog';
    let token = 'not-used';
    function loadSetting(setting: ISettingRegistry.ISettings): void {
      hostUrl = setting.get('unityCatalogHostUrl').composite as string;
      token = setting.get('unityCatalogToken').composite as string;
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
  }
};

export default extension;
