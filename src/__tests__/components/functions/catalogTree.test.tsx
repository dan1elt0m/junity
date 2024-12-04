import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CatalogTree } from '../../../components/tree/CatalogTree';
import { NotebookTrackerContext } from '../../../context/notebook-tracker';
import AuthContext from '../../../context/auth';
import { useListCatalogs } from '../../../hooks/catalog';
import { useListSchemas } from '../../../hooks/schema';
import { useListTables } from '../../../hooks/table';

// Mock the hooks
jest.mock('../../../hooks/catalog');
jest.mock('../../../hooks/schema');
jest.mock('../../../hooks/table');

const mockUseListCatalogs = useListCatalogs as jest.Mock;
const mockUseListSchemas = useListSchemas as jest.Mock;
const mockUseListTables = useListTables as jest.Mock;

describe('CatalogTree', () => {
  beforeEach(() => {
    mockUseListCatalogs.mockReturnValue({
      data: { catalogs: [{ name: 'Catalog1' }, { name: 'Catalog2' }] },
      refetch: jest.fn()
    });
    mockUseListSchemas.mockReturnValue({
      data: { schemas: [{ name: 'Schema1' }, { name: 'Schema2' }] },
      refetch: jest.fn()
    });
    mockUseListTables.mockReturnValue({
      data: {
        tables: [
          {
            name: 'Table1',
            columns: [{ name: 'Column1', type_name: 'string' }]
          }
        ]
      },
      refetch: jest.fn()
    });
    // Mock window.location.reload
    Object.defineProperty(window, 'location', {
      value: {
        ...window.location,
        reload: jest.fn()
      },
      writable: true
    });
  });

  it('renders tree', () => {
    render(
      <NotebookTrackerContext.Provider value={null}>
        <AuthContext.Provider
          value={{ authenticated: true, accessToken: '', currentUser: '' }}
        >
          <CatalogTree />
        </AuthContext.Provider>
      </NotebookTrackerContext.Provider>
    );

    expect(screen.getByText('Catalog1')).toBeInTheDocument();
    expect(screen.getByText('Catalog2')).toBeInTheDocument();
  });
});
