import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CatalogDetails from '../../../components/explorer/CatalogDetails';
import { CatalogInterface, SchemaInterface } from '../../../types/interfaces';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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

const mockSchemas: SchemaInterface[] = [
  {
    name: 'Test Schema 1',
    owner: 'Test Owner 1',
    comment: 'Test Comment 1',
    schema_id: '1',
    catalog_name: 'Test Catalog',
    created_at: Date.now(),
    updated_at: Date.now(),
    created_by: 'Test Creator 1',
    updated_by: 'Test Updater 1'
  },
  {
    name: 'Test Schema 2',
    owner: 'Test Owner 2',
    comment: 'Test Comment 2',
    schema_id: '2',
    catalog_name: 'Test Catalog',
    created_at: Date.now(),
    updated_at: Date.now(),
    created_by: 'Test Creator 2',
    updated_by: 'Test Updater 2'
  }
];

const queryClient = new QueryClient();

jest.mock('../../../hooks/schema', () => ({
  useListSchemas: () => ({
    data: { schemas: mockSchemas }
  })
}));

describe('CatalogDetails', () => {
  it('renders catalog details correctly', () => {
    render(
      <QueryClientProvider client={queryClient}>
      <CatalogDetails catalog={mockCatalog} onSchemaClick={jest.fn()} />
      </QueryClientProvider>
        );

    expect(
      screen.getByRole('heading', { name: /Test Catalog/i })
    ).toBeInTheDocument();
    expect(screen.getByText('Test Owner')).toBeInTheDocument();
    expect(screen.getByText('Test Comment')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Test Creator')).toBeInTheDocument();
    expect(screen.getByText('Test Updater')).toBeInTheDocument();
  });

  it('renders schemas correctly', () => {
    render(
            <QueryClientProvider client={queryClient}>
      <CatalogDetails catalog={mockCatalog} onSchemaClick={jest.fn()} />
              </QueryClientProvider>);

    expect(screen.getByText('Test Schema 1')).toBeInTheDocument();
    expect(screen.getByText('Test Schema 2')).toBeInTheDocument();
  });
});
