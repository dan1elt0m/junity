import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILabShell
} from '@jupyterlab/application';

import { ReactWidget } from '@jupyterlab/ui-components';
import { INotebookTracker } from '@jupyterlab/notebook';
import CatalogTree from './catalogTree';
import * as React from 'react';
import '../style/index.css'; // Import the CSS file

/**
 * A widget to display the catalog tree.
 */
class CatalogTreeWidget extends ReactWidget {
  private notebookTracker: INotebookTracker;

  constructor(notebookTracker: INotebookTracker) {
    super();
    this.notebookTracker = notebookTracker;
    this.id = 'catalog-tree-widget';
    this.title.closable = true;
    this.addClass('jp-CatalogTreeWidget');
  }

  render() {
    return <CatalogTree notebookTracker={this.notebookTracker} />;
  }
}

/**
 * Initialization data for the jupyterlab-sidepanel extension.

 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-sidepanel:plugin',
  autoStart: true,
  requires: [ILabShell, INotebookTracker],
  activate: (
    app: JupyterFrontEnd,
    shell: ILabShell,
    notebookTracker: INotebookTracker
  ) => {
    console.log('JupyterLab extension Junity is activated!');
    const catalogTreeWidget = new CatalogTreeWidget(notebookTracker);
    catalogTreeWidget.title.label = 'Catalog';
    catalogTreeWidget.title.iconClass = 'jp-icon-extension jp-SideBar-tabIcon';
    shell.add(catalogTreeWidget, 'left');
  }
};

export default extension;
