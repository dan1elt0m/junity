import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { CatalogTree } from '../components/catalogTree';
import { NotebookTrackerContext } from '../context/notebookTracker';
import AuthContext from '../context/auth';
import { useListCatalogs} from '../hooks/catalog';
import { useListSchemas } from '../hooks/schema';
import { useListTables } from '../hooks/table';


// Mock the hooks
jest.mock('../hooks/catalog');
jest.mock('../hooks/schema');
jest.mock('../hooks/table');

const mockUseListCatalogs = useListCatalogs as jest.Mock;
const mockUseListSchemas = useListSchemas as jest.Mock;
const mockUseListTables = useListTables as jest.Mock;

describe('CatalogTree', () => {
  beforeEach(() => {
    mockUseListCatalogs.mockReturnValue({
      data: { catalogs: [{ name: 'Catalog1' }, { name: 'Catalog2' }] },
    });
    mockUseListSchemas.mockReturnValue({
      data: { schemas: [{ name: 'Schema1' }, { name: 'Schema2' }] },
    });
    mockUseListTables.mockReturnValue({
      data: { tables: [{ name: 'Table1', columns: [{ name: 'Column1', type_name: 'string' }] }] },
    });
  });

  it('renders catalogs', () => {
    render(
      <NotebookTrackerContext.Provider value={null}>
        <AuthContext.Provider value={{ authenticated: true }}>
          <CatalogTree />
        </AuthContext.Provider>
      </NotebookTrackerContext.Provider>
    );

    expect(screen.getByText('Catalog1')).toBeInTheDocument();
    expect(screen.getByText('Catalog2')).toBeInTheDocument();
  });

  it('expands and collapses catalogs', () => {
    render(
      <NotebookTrackerContext.Provider value={null}>
        <AuthContext.Provider value={{ authenticated: true }}>
          <CatalogTree />
        </AuthContext.Provider>
      </NotebookTrackerContext.Provider>
    );

    fireEvent.click(screen.getByText('Catalog1'));
    expect(screen.getByText('Schema1')).toBeInTheDocument();
    expect(screen.getByText('Schema2')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Catalog1'));
    expect(screen.queryByText('Schema1')).not.toBeInTheDocument();
    expect(screen.queryByText('Schema2')).not.toBeInTheDocument();
  });

  it('expands and collapses schemas', () => {
    render(
      <NotebookTrackerContext.Provider value={null}>
        <AuthContext.Provider value={{ authenticated: true }}>
          <CatalogTree />
        </AuthContext.Provider>
      </NotebookTrackerContext.Provider>
    );

    fireEvent.click(screen.getByText('Catalog1'));
    fireEvent.click(screen.getByText('Schema1'));
    expect(screen.getByText('Table1')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Schema1'));
    expect(screen.queryByText('Table1')).not.toBeInTheDocument();
  });

  it('logs out the user', () => {
    render(
      <NotebookTrackerContext.Provider value={null}>
        <AuthContext.Provider value={{ authenticated: true, accessToken:'', currentUser: '' }}>
          <CatalogTree />
        </AuthContext.Provider>
      </NotebookTrackerContext.Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /logout/i }));
    expect(document.cookie).not.toContain('authenticated');
    expect(document.cookie).not.toContain('access_token');
  });
});