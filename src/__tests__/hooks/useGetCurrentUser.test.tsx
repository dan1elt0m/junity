import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { useGetCurrentUser } from '../../hooks/user';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClientContext, getClient } from '../../context/client';


const queryClient = new QueryClient();

describe('useGetCurrentUser', () => {
  it('fetches and returns the current user', async () => {
    const user = {
      id: '1',
      userName: 'testuser',
      displayName: 'Test User',
      emails: [{ value: 'testuser@example.com' }],
      photos: [{ value: 'http://example.com/photo.jpg' }]
    };

    const apiClient = getClient('http://localhost:8080', 'not-set');
    const { result } = renderHook(() => useGetCurrentUser("valid-token"), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          <ClientContext.Provider value={apiClient}>
            {children}
          </ClientContext.Provider>
        </QueryClientProvider>
      )
    });

    await waitFor(() =>
      expect(result.current.data).toEqual(
{"displayName": "Test User", "emails": [{"value": "testuser@example.com"}], "id": "1", "photos": [{"value": "http://example.com/photo.jpg"}], "userName": "testuser"}
      )
    );
  });
});