import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TableDetails from '../../../components/explorer/TableDetails';
import { TableInterface } from '../../../types/interfaces';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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

const queryClient = new QueryClient();

describe('TableDetails', () => {
  it('renders table details correctly', () => {
    render(
      <QueryClientProvider client={queryClient}>
      <TableDetails table={mockTable} />
        </QueryClientProvider>
        );
    screen.getAllByText('Test Table').forEach(element => {
      expect(element).toBeInTheDocument();
    });
    expect(screen.getByText('Test Owner')).toBeInTheDocument();
    expect(screen.getByText('Test Comment')).toBeInTheDocument();
    expect(screen.getByText('CSV')).toBeInTheDocument();
    expect(screen.getByText('s3://bucket/path')).toBeInTheDocument();
  });
});
