import React from 'react';
import { render, screen  } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SideBar } from '../../../components/functions/SideBar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const renderWithQueryClient = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};

describe('Menu Component', () => {
  it('should render the selection buttons', () => {
    renderWithQueryClient(<SideBar />);
    const explorerButton = screen.getByRole('button', {
      name: 'explorer-button'
    });
    expect(explorerButton).toBeInTheDocument();
  });
});
