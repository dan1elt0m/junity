import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ListSchema from '../../../components/explorer/ListSchema';
import { SchemaInterface } from '../../../types/interfaces';

const mockSchemas: SchemaInterface[] = [
  {
    name: 'Schema 1',
    owner: 'Owner 1',
    comment: 'Comment 1',
    schema_id: '1',
    catalog_name: 'Catalog 1',
    created_at: Date.now(),
    updated_at: Date.now(),
    created_by: 'Creator 1',
    updated_by: 'Updater 1'
  },
  {
    name: 'Schema 2',
    owner: 'Owner 2',
    comment: 'Comment 2',
    schema_id: '2',
    catalog_name: 'Catalog 2',
    created_at: Date.now(),
    updated_at: Date.now(),
    created_by: 'Creator 2',
    updated_by: 'Updater 2'
  }
];

describe('ListSchema', () => {
  it('renders a list of schemas', () => {
    render(<ListSchema schemas={mockSchemas} onSchemaClick={jest.fn()} />);
    expect(screen.getByText('Schema 1')).toBeInTheDocument();
    expect(screen.getByText('Schema 2')).toBeInTheDocument();
  });
});
