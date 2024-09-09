// Update test cases to pass the required notebookTracker prop
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CatalogTree from '../catalogTree';
import { fetchCatalogs, fetchSchemas, fetchTables } from '../api';
import { INotebookTracker } from '@jupyterlab/notebook';

// Mock the API functions
jest.mock('../api');

const mockFetchCatalogs = fetchCatalogs as jest.MockedFunction<
  typeof fetchCatalogs
>;
const mockFetchSchemas = fetchSchemas as jest.MockedFunction<
  typeof fetchSchemas
>;
const mockFetchTables = fetchTables as jest.MockedFunction<typeof fetchTables>;

// Moc
describe('CatalogTree', () => {
  beforeEach(() => {
    mockFetchCatalogs.mockResolvedValue([
      { name: 'Catalog1' },
      { name: 'Catalog2' }
    ]);
    mockFetchSchemas.mockResolvedValue([
      { name: 'Schema1' },
      { name: 'Schema2' }
    ]);
    mockFetchTables.mockResolvedValue([{ name: 'Table1' }, { name: 'Table2' }]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders catalogs', async () => {
    // @ts-ignore
    render(<CatalogTree notebookTracker={INotebookTracker} />);

    await waitFor(() => {
      const catalog1 = screen.queryByText('Catalog1');
      const catalog2 = screen.queryByText('Catalog2');
      expect(catalog1).not.toBeNull();
      expect(catalog2).not.toBeNull();
    });
  });

  test('fetches and displays schemas when a catalog is expanded', async () => {
    // @ts-ignore
    render(<CatalogTree notebookTracker={INotebookTracker} />);

    fireEvent.click(screen.getByText('Catalog1'));

    await waitFor(() => {
      const schema1 = screen.queryByText('Schema1');
      const schema2 = screen.queryByText('Schema2');
      expect(schema1).not.toBeNull();
      expect(schema2).not.toBeNull();
    });
  });

  test('fetches and displays tables when a schema is expanded', async () => {
    // @ts-ignore
    render(<CatalogTree notebookTracker={INotebookTracker} />);

    fireEvent.click(screen.getByText('Catalog1'));
    await waitFor(() => screen.queryByText('Schema1'));

    fireEvent.click(screen.getByText('Schema1'));

    await waitFor(() => {
      const table1 = screen.queryByText('Table1');
      const table2 = screen.queryByText('Table2');
      expect(table1).not.toBeNull();
      expect(table2).not.toBeNull();
    });
  });
});
