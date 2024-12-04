import * as React from 'react';
import { ReactWidget } from '@jupyterlab/ui-components';
import { INotebookTracker } from '@jupyterlab/notebook';
import { googleLogout } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import AppContext from '../../context/app-context';
import { NotebookTrackerContext } from '../../context/notebook-tracker';
import { ClientContext, getClient } from '../../context/client';
import AuthContext, { LogoutContext } from '../../context/auth';
import { Box, Container, Typography } from '@mui/material';
import { SideBar } from '../functions/SideBar';
import { GoogleAuth } from '../login/GoogleAuth';
import { MainPanel } from '../panels/MainPanel';
import { JupyterFrontEnd } from '@jupyterlab/application';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      experimental_prefetchInRender: true
    }
  }
});

export class TreeWidget extends ReactWidget {
  private notebookTracker: INotebookTracker;
  private app: JupyterFrontEnd;
  public hostUrl: string;
  public authenticated: boolean;
  private googleAuthEnabled: boolean = false;
  private googleClientId: string = '';
  private token: string;

  constructor(
    app: JupyterFrontEnd,
    notebookTracker: INotebookTracker,
    hostUrl: string,
    token: string,
    googleAuthEnabled: boolean,
    googleClientId: string
  ) {
    super();
    this.app = app;
    this.notebookTracker = notebookTracker;
    this.hostUrl = hostUrl;
    this.authenticated = false;
    this.token = Cookies.get('access_token') || token;
    this.googleAuthEnabled = googleAuthEnabled;
    this.googleClientId = googleClientId;
    this.id = 'junity-widget';
    this.title.closable = true;
    this.addClass('jp-CatalogTreeWidget');

    this.setAuthenticated = this.setAuthenticated.bind(this);
    this.setToken = this.setToken.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  setHostUrl(hostUrl: string) {
    this.hostUrl = hostUrl;
    this.update();
  }

  setAuthenticationEnabled(googleAuthEnabled: boolean) {
    this.googleAuthEnabled = googleAuthEnabled;
    this.update();
  }

  setToken(token: string) {
    this.token = token;
    this.update();
  }

  updateGoogleClientId(googleClientId: string) {
    this.googleClientId = googleClientId;
    this.update();
  }

  setAuthenticated(authenticated: boolean) {
    this.authenticated = authenticated;
    this.update();
  }

  handleLogout = () => {
    Cookies.remove('authenticated');
    Cookies.remove('access_token');
    googleLogout();
    this.setAuthenticated(false);
    this.setToken('');
  };

  render() {
    return (
      <AppContext.Provider value={{ app: this.app }}>
        <AuthContext.Provider
          value={{
            accessToken: this.token,
            authenticated: this.authenticated,
            currentUser: ''
          }}
        >
          <NotebookTrackerContext.Provider value={this.notebookTracker}>
            <ClientContext.Provider value={getClient(this.hostUrl, this.token)}>
              <QueryClientProvider client={queryClient}>
                <LogoutContext.Provider value={{ logout: this.handleLogout }}>
                  <MainPanel>
                    {this.googleAuthEnabled &&
                    !this.authenticated &&
                    !this.token ? (
                      !this.googleClientId ? (
                        <Container>
                          <Typography variant="h6" color="error">
                            Error: Google authentication is enabled, but no
                            client ID is set.
                          </Typography>
                        </Container>
                      ) : (
                        <Container>
                          <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="flex-start"
                            p={3}
                          >
                            <Box
                              border={1}
                              borderColor="blue"
                              bgcolor="white"
                              p={4}
                              m={3}
                              borderRadius={4}
                              boxShadow={3}
                              textAlign="center"
                              maxWidth={350}
                            >
                              <Typography
                                variant="body1"
                                margin={3}
                                gutterBottom
                              >
                                Sign in to access Unity Catalog
                              </Typography>
                              <GoogleAuth
                                googleAuthEnabled={this.googleAuthEnabled}
                                googleClientId={this.googleClientId}
                                setAuthenticated={this.setAuthenticated}
                                updateToken={this.setToken}
                              />
                              <Typography
                                variant="body2"
                                margin={3}
                                gutterBottom
                              >
                                Contact your site administrator to request
                                access.
                              </Typography>
                            </Box>
                          </Box>
                        </Container>
                      )
                    ) : (
                      <SideBar />
                    )}
                  </MainPanel>
                </LogoutContext.Provider>
              </QueryClientProvider>
            </ClientContext.Provider>
          </NotebookTrackerContext.Provider>
        </AuthContext.Provider>
      </AppContext.Provider>
    );
  }
}
