import { IFrame } from '@jupyterlab/apputils';
import { PageConfig } from '@jupyterlab/coreutils';

export class DocsWidget extends IFrame {
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
