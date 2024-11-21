import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { useListTables } from '../../hooks/table';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClientContext, getClient } from '../../context/client';

const queryClient = new QueryClient();

describe('useListTables', () => {
  it('fetches and returns tables', async () => {
    const apiClient = getClient('http://localhost:8080', 'not-set');
    const { result } = renderHook(
      () => useListTables({ catalog: 'Catalog1', schema: 'Schema1' }),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={queryClient}>
            <ClientContext.Provider value={apiClient}>
              {children}
            </ClientContext.Provider>
          </QueryClientProvider>
        )
      }
    );

    await waitFor(() =>
      expect(result.current.data?.tables).toEqual([
        { id: '1', name: 'Table1' },
        { id: '2', name: 'Table2' }
      ])
    );
  });
});
