import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExplorerDetails from '../../../components/explorer/ExplorerDetails';
import { useListCatalogs } from '../../../hooks/catalog';
import { CatalogInterface } from '../../../types/interfaces';

// Mock the useListCatalogs hook
jest.mock('../../../hooks/catalog');

const mockUseListCatalogs = useListCatalogs as jest.MockedFunction<
  typeof useListCatalogs
>;

describe('ExplorerDetails', () => {
  it('renders loading state initially', () => {
    mockUseListCatalogs.mockReturnValue({
      data: null,
      error: null,
      isLoading: true
    } as any);

    render(<ExplorerDetails onCatalogClick={jest.fn()} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders error state', async () => {
    mockUseListCatalogs.mockReturnValue({
      data: null,
      error: new Error('Failed to fetch catalogs'),
      isLoading: false
    } as any);

    render(<ExplorerDetails onCatalogClick={jest.fn()} />);

    expect(
      screen.getByText('Error fetching catalogs: Failed to fetch catalogs')
    ).toBeInTheDocument();
  });

  it('renders catalogs', async () => {
    const mockCatalogs: CatalogInterface[] = [
      {
        id: '1',
        name: 'Catalog 1',
        owner: 'Owner 1',
        created_at: Date.now()
      } as any,
      {
        id: '2',
        name: 'Catalog 2',
        owner: 'Owner 2',
        created_at: Date.now()
      } as any
    ];

    mockUseListCatalogs.mockReturnValue({
      data: { catalogs: mockCatalogs },
      error: null,
      isLoading: false
    } as any);

    render(<ExplorerDetails onCatalogClick={jest.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('Catalog 1')).toBeInTheDocument();
      expect(screen.getByText('Catalog 2')).toBeInTheDocument();
    });
  });
});
