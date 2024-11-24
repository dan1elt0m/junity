import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ListColumns from '../../../components/explorer/ListColumns';
import { ColumnInterface } from '../../../types/interfaces';

const mockColumns: ColumnInterface[] = [
  {
    name: 'Column 1',
    type_name: 'String',
    type_text: 'Comment 1',
    created_at: Date.now()
  },
  {
    name: 'Column 2',
    type_name: 'Integer',
    type_text: 'Comment 2',
    created_at: Date.now()
  }
];

describe('ListColumns', () => {
  it('renders a list of columns', () => {
    render(<ListColumns columns={mockColumns} />);
    expect(screen.getByText('Column 1')).toBeInTheDocument();
    expect(screen.getByText('Column 2')).toBeInTheDocument();
    expect(screen.getByText('String')).toBeInTheDocument();
    expect(screen.getByText('Integer')).toBeInTheDocument();
    expect(screen.getByText('Comment 1')).toBeInTheDocument();
    expect(screen.getByText('Comment 2')).toBeInTheDocument;
  });
});
