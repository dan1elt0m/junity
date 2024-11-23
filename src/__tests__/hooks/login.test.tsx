import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLoginWithToken } from '../../hooks/login';
import { ClientContext, getClient } from '../../context/client';

// Mock axios
const queryClient = new QueryClient();

describe('useLoginWithToken', () => {
  it('should successfully exchange token', async () => {
    const accessToken = 'test-access-token';
    const idToken = 'bla';
    const apiClient = getClient('http://localhost:8080', 'not-set');
    const { result } = renderHook(() => useLoginWithToken(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          <ClientContext.Provider value={apiClient}>
            {children}
          </ClientContext.Provider>
        </QueryClientProvider>
      )
    });

    act(() => {
      console.log('Calling mutate with idToken:', idToken);
      result.current.mutate(idToken);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual({ access_token: accessToken });
  });
});
