import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ListCatalogs from '../../../components/explorer/ListCatalogs';
import { CatalogInterface } from '../../../types/interfaces';

const mockCatalogs: CatalogInterface[] = [
  {
    id: '1',
    name: 'Catalog 1',
    owner: 'Owner 1',
    created_at: Date.parse('2023-01-01T00:00:00Z')
  },
  {
    id: '2',
    name: 'Catalog 2',
    owner: 'Owner 2',
    created_at: Date.parse('2023-01-02T00:00:00Z')
  }
] as any;

describe('ListCatalogs', () => {
  it('renders a list of catalogs', () => {
    render(<ListCatalogs catalogs={mockCatalogs} onCatalogClick={jest.fn()} />);
    expect(screen.getByText('Catalog 1')).toBeInTheDocument();
    expect(screen.getByText('Catalog 2')).toBeInTheDocument();
    expect(screen.getByText('Owner 1')).toBeInTheDocument();
    expect(screen.getByText('Owner 2')).toBeInTheDocument();
  });

  it('calls onCatalogClick when a catalog row is clicked', () => {
    const handleCatalogClick = jest.fn();
    render(
      <ListCatalogs
        catalogs={mockCatalogs}
        onCatalogClick={handleCatalogClick}
      />
    );
    fireEvent.click(screen.getByText('Catalog 1'));
    expect(handleCatalogClick).toHaveBeenCalledWith(mockCatalogs[0]);
  });

  it('changes row background color on mouse enter and leave', () => {
    render(<ListCatalogs catalogs={mockCatalogs} onCatalogClick={jest.fn()} />);
    const catalogRow = screen.getByText('Catalog 1').closest('tr');
    expect(catalogRow).toHaveStyle('background-color: #f5f5f5');
    fireEvent.mouseEnter(catalogRow!);
    expect(catalogRow).toHaveStyle('background-color: #e0e0e0');
    fireEvent.mouseLeave(catalogRow!);
    expect(catalogRow).toHaveStyle('background-color: #f5f5f5');
  });
});
