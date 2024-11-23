import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Menu } from '../../components/menu';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const renderWithQueryClient = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};

describe('Menu Component', () => {
  it('should render the selection buttons', () => {
    renderWithQueryClient(<Menu />);
    const treeButton = screen.getByRole('button', { name: 'tree-button' });
    const explorerButton = screen.getByRole('button', {
      name: 'explorer-button'
    });
    expect(treeButton).toBeInTheDocument();
    expect(explorerButton).toBeInTheDocument();
  });

  it('should display CatalogTree when tree button is clicked', () => {
    renderWithQueryClient(<Menu />);
    const treeButton = screen.getByRole('button', { name: 'tree-button' });
    fireEvent.click(treeButton);
    expect(screen.getByText('Catalogs')).toBeInTheDocument();
  });

  it('should display Other Content when explorer button is clicked', () => {
    renderWithQueryClient(<Menu />);
    const explorerButton = screen.getByRole('button', {
      name: 'explorer-button'
    });
    fireEvent.click(explorerButton);
    expect(screen.getByText('Other Content')).toBeInTheDocument();
  });
});
