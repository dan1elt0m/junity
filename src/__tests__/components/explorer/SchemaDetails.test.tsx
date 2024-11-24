import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SchemaDetails from '../../../components/explorer/SchemaDetails';
import { SchemaInterface } from '../../../types/interfaces';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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

const queryClient = new QueryClient();

const renderWithQueryClient = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};

describe('SchemaDetails', () => {
  it('renders schema details correctly', () => {
    renderWithQueryClient(
      <SchemaDetails schema={mockSchema} onTableClick={jest.fn()} />
    );
    screen.getAllByText('Test Schema').forEach(element => {
      expect(element).toBeInTheDocument();
    });
    screen.getAllByText('Test Owner').forEach(element => {
      expect(element).toBeInTheDocument();
    });
    screen.getAllByText('Test Comment').forEach(element => {
      expect(element).toBeInTheDocument();
    });
    screen.getAllByText('Test Catalog').forEach(element => {
      expect(element).toBeInTheDocument();
    });
  });
});
