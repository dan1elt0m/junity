import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ListTables from '../../../components/explorer/ListTables';
import { TableInterface } from '../../../types/interfaces';

const mockTables: TableInterface[] = [
  {
    table_id: '1',
    table_type: 'BASE TABLE',
    catalog_name: 'Test Catalog',
    schema_name: 'Test Schema',
    name: 'Test Table 1',
    comment: 'Test Comment 1',
    created_at: Date.now(),
    updated_at: Date.now(),
    data_source_format: 'CSV',
    storage_location: 's3://bucket/path',
    columns: [],
    owner: 'Test Owner 1',
    created_by: 'Test Creator 1',
    updated_by: 'Test Updater 1'
  },
  {
    table_id: '2',
    table_type: 'BASE TABLE',
    catalog_name: 'Test Catalog',
    schema_name: 'Test Schema',
    name: 'Test Table 2',
    comment: 'Test Comment 2',
    created_at: Date.now(),
    updated_at: Date.now(),
    data_source_format: 'CSV',
    storage_location: 's3://bucket/path',
    columns: [],
    owner: 'Test Owner 2',
    created_by: 'Test Creator 2',
    updated_by: 'Test Updater 2'
  }
];

describe('ListTables', () => {
  it('renders a list of tables', () => {
    render(<ListTables tables={mockTables} onTableClick={jest.fn()} />);
    expect(screen.getByText('Test Table 1')).toBeInTheDocument();
    expect(screen.getByText('Test Table 2')).toBeInTheDocument();
    expect(screen.getByText('Test Owner 1')).toBeInTheDocument();
    expect(screen.getByText('Test Owner 2')).toBeInTheDocument();
  });

  it('calls onTableClick when a table row is clicked', () => {
    const handleTableClick = jest.fn();
    render(<ListTables tables={mockTables} onTableClick={handleTableClick} />);
    fireEvent.click(screen.getByText('Test Table 1'));
    expect(handleTableClick).toHaveBeenCalledWith(mockTables[0]);
  });

  it('changes row background color on mouse enter and leave', () => {
    render(<ListTables tables={mockTables} onTableClick={jest.fn()} />);
    const tableRow = screen.getByText('Test Table 1').closest('tr');
    expect(tableRow).toHaveStyle('background-color: #f5f5f5');
    fireEvent.mouseEnter(tableRow!);
    expect(tableRow).toHaveStyle('background-color: #e0e0e0');
    fireEvent.mouseLeave(tableRow!);
    expect(tableRow).toHaveStyle('background-color: #f5f5f5');
  });
});
