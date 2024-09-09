import React from 'react';
import { ILabShell } from '@jupyterlab/application';
import extension from '../index';
import CatalogTreeWidget from '../catalogTree';
import { JupyterFrontEnd } from '@jupyterlab/application';

class ConcreteJupyterFrontEnd extends JupyterFrontEnd {
  name: string;
  namespace: string;
  version: string;

  constructor(options: JupyterFrontEnd.IOptions<any>) {
    super(options);
    this.name = 'jupyterlab-sidepanel';
    this.namespace = 'jupyterlab';
    this.version = '1.0.0';
  }

  // Implement any abstract methods or properties if required
}
jest.mock('@jupyterlab/application', () => ({
  JupyterFrontEndPlugin: jest.fn(),
  ILabShell: jest.fn()
}));

jest.mock('../catalogTree', () => jest.fn(() => <div>CatalogTree</div>));

describe('JupyterLab extension', () => {
  let app: ConcreteJupyterFrontEnd;
  let shell: ILabShell;

  beforeEach(() => {
    app = new ConcreteJupyterFrontEnd({
      restored: Promise.resolve(undefined),
      shell: undefined
    });
    shell = {
      add: jest.fn()
    } as unknown as ILabShell;
  });

  test('should add CatalogTreeWidget to the shell', () => {
    extension.activate(app, shell);
    expect(shell.add).toHaveBeenCalledWith(
      expect.any(CatalogTreeWidget),
      'left'
    );
  });
});
