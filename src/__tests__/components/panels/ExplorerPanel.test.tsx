import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExplorerPanel from '../../../components/panels/ExplorerPanel';
import {
  CatalogInterface,
  SchemaInterface,
  TableInterface
} from '../../../types/interfaces';

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

describe('ExplorerPanel', () => {
  it('renders message when no entity is selected', () => {
    render(<ExplorerPanel entity={null} />);
    expect(
      screen.getByText('Select an entity to view details')
    ).toBeInTheDocument();
  });

  it('renders catalog details correctly', () => {
    render(<ExplorerPanel entity={mockCatalog} />);
    expect(screen.getByText('Catalog: Test Catalog')).toBeInTheDocument();
  });

  it('renders schema details correctly', () => {
    render(<ExplorerPanel entity={mockSchema} />);
    expect(screen.getByText('Schema: Test Schema')).toBeInTheDocument();
  });

  it('renders table details correctly', () => {
    render(<ExplorerPanel entity={mockTable} />);
    expect(screen.getByText('Table: Test Table')).toBeInTheDocument();
  });
});
