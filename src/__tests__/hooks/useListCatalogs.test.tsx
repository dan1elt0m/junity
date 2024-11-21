import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { useListCatalogs } from '../../hooks/catalog';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClientContext, getClient } from '../../context/client';

const queryClient = new QueryClient();

describe('useListCatalogs', () => {
  it('fetches and returns catalogs', async () => {
    const apiClient = getClient('http://localhost:8080', 'not-set');
    const { result } = renderHook(() => useListCatalogs(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          <ClientContext.Provider value={apiClient}>
            {children}
          </ClientContext.Provider>
        </QueryClientProvider>
      )
    });

    await waitFor(() =>
      expect(result.current.data?.catalogs).toEqual([
        { id: '1', name: 'Catalog1' },
        { id: '2', name: 'Catalog2' }
      ])
    );
  });
});
