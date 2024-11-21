import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { useListSchemas } from '../../hooks/schema';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClientContext, getClient } from '../../context/client';

const queryClient = new QueryClient();

describe('useListSchemas', () => {
  it('fetches and returns Schemas', async () => {
    const apiClient = getClient('http://localhost:8080', 'not-set');
    const { result } = renderHook(
      () => useListSchemas({ catalog: 'Catalog1' }),
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
      expect(result.current.data?.schemas).toEqual([
        { id: '1', name: 'Schema1' },
        { id: '2', name: 'Schema2' }
      ])
    );
  });
});
