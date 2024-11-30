import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import CatalogExplorer from '../../../components/functions/CatalogExplorer';
import {
  CatalogInterface,
  SchemaInterface,
  TableInterface
} from '../../../types/interfaces';
import AppContext, { AppContextProps } from '../../../context/app-context';
import { ClientContext } from '../../../context/client';
import { AxiosInstance } from 'axios';

const mockApp: AppContextProps = {
  app: {
    name: 'Test App',
    namespace: 'test-namespace',
    version: '1.0.0',
    commandLinker: {} as any,
    shell: {
      add: jest.fn(),
      activateById: jest.fn(),
      widgets: jest.fn().mockReturnValue([]) // Ensure widgets returns an iterable object
    } as any
  } as any
};

const mockApiClient: AxiosInstance = {
  defaults: {
    headers: {
      common: {},
      delete: {},
      get: {},
      head: {},
      post: {},
      put: {},
      patch: {},
      options: {}
    } as any
  },
  interceptors: {
    request: { use: jest.fn(), eject: jest.fn(), clear: jest.fn() },
    response: { use: jest.fn(), eject: jest.fn(), clear: jest.fn() }
  },
  getUri: jest.fn(),
  request: jest.fn(),
  get: jest.fn(),
  delete: jest.fn(),
  head: jest.fn(),
  options: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  patch: jest.fn()
} as any;

const mockCatalog: CatalogInterface = {
  name: 'Test Catalog',
  owner: 'Test Owner',
  comment: 'Test Comment',
  id: '1',
  created_at: Date.now(),
  updated_at: Date.now(),
  created_by: 'Test Creator',
  updated_by: 'Test Updater'
};

const mockSchema: SchemaInterface = {
  name: 'Test Schema',
  owner: 'Test Owner',
  comment: 'Test Comment',
  schema_id: '1',
  catalog_name: 'Test Catalog',
  created_at: Date.now(),
  updated_at: Date.now(),
  created_by: 'Test Creator',
  updated_by: 'Test Updater'
};

const mockTable: TableInterface = {
  table_id: '1',
  table_type: 'BASE TABLE',
  catalog_name: 'Test Catalog',
  schema_name: 'Test Schema',
  name: 'Test Table',
  comment: 'Test Comment',
  created_at: Date.now(),
  updated_at: Date.now(),
  data_source_format: 'CSV',
  storage_location: 's3://bucket/path',
  columns: [],
  owner: 'Test Owner',
  created_by: 'Test Creator',
  updated_by: 'Test Updater'
};

describe('CatalogExplorer', () => {
  it('should create and open a widget for a catalog', () => {
    const ref = React.createRef<any>();
    render(
      <AppContext.Provider value={mockApp}>
        <ClientContext.Provider value={mockApiClient}>
          <CatalogExplorer ref={ref} />
        </ClientContext.Provider>
      </AppContext.Provider>
    );

    ref.current.handleExploreClick(mockCatalog);

    expect(mockApp.app.shell.add).toHaveBeenCalled();
    expect(mockApp.app.shell.activateById).toHaveBeenCalled();
  });

  it('should create and open a widget for a schema', () => {
    const ref = React.createRef<any>();
    render(
      <AppContext.Provider value={mockApp}>
        <ClientContext.Provider value={mockApiClient}>
          <CatalogExplorer ref={ref} />
        </ClientContext.Provider>
      </AppContext.Provider>
    );

    ref.current.handleExploreClick(mockSchema);

    expect(mockApp.app.shell.add).toHaveBeenCalled();
    expect(mockApp.app.shell.activateById).toHaveBeenCalled();
  });

  it('should create and open a widget for a table', () => {
    const ref = React.createRef<any>();
    render(
      <AppContext.Provider value={mockApp}>
        <ClientContext.Provider value={mockApiClient}>
          <CatalogExplorer ref={ref} />
        </ClientContext.Provider>
      </AppContext.Provider>
    );

    ref.current.handleExploreClick(mockTable);

    expect(mockApp.app.shell.add).toHaveBeenCalled();
    expect(mockApp.app.shell.activateById).toHaveBeenCalled();
  });
});
