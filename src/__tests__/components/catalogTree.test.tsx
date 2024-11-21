import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CatalogTree } from '../../components/catalogTree';
import { NotebookTrackerContext } from '../../context/notebookTracker';
import AuthContext from '../../context/auth';
import { useListCatalogs } from '../../hooks/catalog';
import { useListSchemas } from '../../hooks/schema';
import { useListTables } from '../../hooks/table';
import Cookies from 'js-cookie';

// Mock the hooks
jest.mock('../../hooks/catalog');
jest.mock('../../hooks/schema');
jest.mock('../../hooks/table');

const mockUseListCatalogs = useListCatalogs as jest.Mock;
const mockUseListSchemas = useListSchemas as jest.Mock;
const mockUseListTables = useListTables as jest.Mock;

describe('CatalogTree', () => {
  beforeEach(() => {
    mockUseListCatalogs.mockReturnValue({
      data: { catalogs: [{ name: 'Catalog1' }, { name: 'Catalog2' }] }
    });
    mockUseListSchemas.mockReturnValue({
      data: { schemas: [{ name: 'Schema1' }, { name: 'Schema2' }] }
    });
    mockUseListTables.mockReturnValue({
      data: {
        tables: [
          {
            name: 'Table1',
            columns: [{ name: 'Column1', type_name: 'string' }]
          }
        ]
      }
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

  it('renders catalogs', () => {
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

  it('expands and collapses catalogs', () => {
    render(
      <NotebookTrackerContext.Provider value={null}>
        <AuthContext.Provider
          value={{ authenticated: true, accessToken: '', currentUser: '' }}
        >
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

  it('expands and collapses all', () => {
    render(
      <NotebookTrackerContext.Provider value={null}>
        <AuthContext.Provider
          value={{ authenticated: true, accessToken: '', currentUser: '' }}
        >
          <CatalogTree />
        </AuthContext.Provider>
      </NotebookTrackerContext.Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /expand-all/i }));
    expect(screen.getByText('Catalog1')).toBeInTheDocument();
    expect(screen.getByText('Catalog2')).toBeInTheDocument();
  });

  it('logs out the user', () => {
    render(
      <NotebookTrackerContext.Provider value={null}>
        <AuthContext.Provider
          value={{ authenticated: true, accessToken: '', currentUser: '' }}
        >
          <CatalogTree />
        </AuthContext.Provider>
      </NotebookTrackerContext.Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /logout/i }));
    expect(document.cookie).not.toContain('authenticated');
    expect(document.cookie).not.toContain('access_token');
  });
  it('should handle logout correctly', () => {
    render(
      <NotebookTrackerContext.Provider value={null}>
        <AuthContext.Provider
          value={{ authenticated: true, accessToken: '', currentUser: '' }}
        >
          <CatalogTree />
        </AuthContext.Provider>
      </NotebookTrackerContext.Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /logout/i }));
    expect(Cookies.get('authenticated')).toBeUndefined();
    expect(Cookies.get('access_token')).toBeUndefined();
    expect(window.location.reload).toHaveBeenCalled();
  });

  it('should toggle expand all nodes', () => {
    render(
      <NotebookTrackerContext.Provider value={null}>
        <AuthContext.Provider
          value={{ authenticated: true, accessToken: '', currentUser: '' }}
        >
          <CatalogTree />
        </AuthContext.Provider>
      </NotebookTrackerContext.Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /expand-all/i }));
    expect(screen.getByText('Catalog1')).toBeInTheDocument();
    expect(screen.getByText('Catalog2')).toBeInTheDocument();
  });

  it('should toggle node expansion', () => {
    render(
      <NotebookTrackerContext.Provider value={null}>
        <AuthContext.Provider
          value={{ authenticated: true, accessToken: '', currentUser: '' }}
        >
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

  it('should render columns correctly', () => {
    mockUseListTables.mockReturnValue({
      data: {
        tables: [
          {
            name: 'Table1',
            columns: [{ name: 'Column1', type_name: 'string' }]
          }
        ]
      }
    });

    render(
      <NotebookTrackerContext.Provider value={null}>
        <AuthContext.Provider
          value={{ authenticated: true, accessToken: '', currentUser: '' }}
        >
          <CatalogTree />
        </AuthContext.Provider>
      </NotebookTrackerContext.Provider>
    );

    fireEvent.click(screen.getByText('Catalog1'));
    fireEvent.click(screen.getByText('Schema1'));
    fireEvent.click(screen.getByText('Table1'));

    const columnElement = screen.queryByText('Column1');
    expect(columnElement).toBeInTheDocument();
    expect(columnElement).toHaveClass('column-name');
  });

  it('should render tables correctly', () => {
    const { container } = render(
      <NotebookTrackerContext.Provider value={null}>
        <AuthContext.Provider
          value={{ authenticated: true, accessToken: '', currentUser: '' }}
        >
          <CatalogTree />
        </AuthContext.Provider>
      </NotebookTrackerContext.Provider>
    );
    fireEvent.click(screen.getByText('Catalog1'));
    fireEvent.click(screen.getByText('Schema1'));
    const tableElement = screen.queryByText('Table1');
    expect(tableElement).toBeInTheDocument();
    expect(container.querySelector('.jp-icon-expand')).toBeInTheDocument();
    expect(container.querySelector('.jp-icon-table')).toBeInTheDocument();
  });

  it('should render schemas correctly', () => {
    const { container } = render(
      <NotebookTrackerContext.Provider value={null}>
        <AuthContext.Provider
          value={{ authenticated: true, accessToken: '', currentUser: '' }}
        >
          <CatalogTree />
        </AuthContext.Provider>
      </NotebookTrackerContext.Provider>
    );
    fireEvent.click(screen.getByText('Catalog1'));
    expect(container.querySelector('.jp-icon-schema')).toBeInTheDocument();
    expect(container.querySelector('.jp-icon-expand')).toBeInTheDocument();
  });
});
