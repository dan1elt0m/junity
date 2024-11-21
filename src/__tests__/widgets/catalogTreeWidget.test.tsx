// catalogTreeWidget.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CatalogTreeWidgetComponent } from '../../widgets/catalogTreeWidget';
import { INotebookTracker } from '@jupyterlab/notebook';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthContext from '../../context/auth';
import { ClientContext } from '../../context/client';
import { NotebookTrackerContext } from '../../context/notebookTracker';
import axios from 'axios';

const queryClient = new QueryClient();

const apiClient = jest.mocked(axios);
jest.mock('js-cookie', () => ({
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn()
}));

const mockNotebookTracker: INotebookTracker = {
  currentWidget: null,
  activeCell: null,
  activeCellChanged: {
    connect: jest.fn(),
    disconnect: jest.fn()
  }
} as unknown as INotebookTracker;

describe('CatalogTreeWidgetComponent', () => {
  const mockSetAuthenticated = jest.fn();
  const mockUpdateToken = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render CatalogTree when authenticated', () => {
    render(
      <AuthContext.Provider
        value={{
          accessToken: 'test-token',
          authenticated: true,
          currentUser: ''
        }}
      >
        <NotebookTrackerContext.Provider value={mockNotebookTracker}>
          <ClientContext.Provider value={apiClient}>
            <QueryClientProvider client={queryClient}>
              <CatalogTreeWidgetComponent
                googleAuthEnabled={true}
                googleClientId="test-client-id"
                setAuthenticated={mockSetAuthenticated}
                updateToken={mockUpdateToken}
              />
            </QueryClientProvider>
          </ClientContext.Provider>
        </NotebookTrackerContext.Provider>
      </AuthContext.Provider>
    );

    expect(screen.getByText('Catalogs')).toBeInTheDocument();
  });

  it('should render CatalogTree when not authenticated, but token is set', () => {
    render(
      <AuthContext.Provider
        value={{
          accessToken: 'test-token',
          authenticated: false,
          currentUser: ''
        }}
      >
        <NotebookTrackerContext.Provider value={mockNotebookTracker}>
          <ClientContext.Provider value={apiClient}>
            <QueryClientProvider client={queryClient}>
              <CatalogTreeWidgetComponent
                googleAuthEnabled={true}
                googleClientId="test-client-id"
                setAuthenticated={mockSetAuthenticated}
                updateToken={mockUpdateToken}
              />
            </QueryClientProvider>
          </ClientContext.Provider>
        </NotebookTrackerContext.Provider>
      </AuthContext.Provider>
    );

    expect(screen.getByText('Catalogs')).toBeInTheDocument();
  });
});
