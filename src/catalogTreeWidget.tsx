import { ReactWidget } from '@jupyterlab/ui-components';
import { INotebookTracker } from '@jupyterlab/notebook';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import CatalogTree from './catalogTree';
import * as React from 'react';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { getClient } from './client';
import { AxiosInstance } from 'axios';
import { QueryClient, QueryClientProvider, useMutation } from '@tanstack/react-query';
import { UC_AUTH_API_PREFIX } from './constants';

const queryClient = new QueryClient();

interface LoginResponse {
  access_token: string;
}

function useLoginWithToken(client: AxiosInstance) {
  return useMutation<LoginResponse, Error, string>({
    mutationFn: async (idToken) => {
      const params = {
        grantType: 'urn:ietf:params:oauth:grant-type:token-exchange',
        requestedTokenType: 'urn:ietf:params:oauth:token-type:access_token',
        subjectTokenType: 'urn:ietf:params:oauth:token-type:id_token',
        subjectToken: idToken,
      };

      return client
        .post(`${UC_AUTH_API_PREFIX}/auth/tokens`, JSON.stringify(params), {})
        .then((response) => response.data)
        .catch((e) => {
          throw new Error(e.response?.data?.message || 'Failed to log in');
        });
    },
  });
}

const CatalogTreeWidgetComponent: React.FC<{
  notebookTracker: INotebookTracker;
  hostUrl: string;
  token: string;
  googleAuthEnabled: boolean;
  googleClientId: string;
  settings: ISettingRegistry;
  authenticated: boolean;
  setAuthenticated: (authenticated: boolean) => void;
}> = ({ notebookTracker, hostUrl, token, googleAuthEnabled, googleClientId, settings,authenticated, setAuthenticated }) => {
  const apiClient = getClient(hostUrl);
  const loginWithToken = useLoginWithToken(apiClient);

  const handleGoogleSignIn = async (response: CredentialResponse) => {
    if (response && response.credential) {
      try {
        const loginResponse = await loginWithToken.mutateAsync(response.credential);
        setAuthenticated(true);
        console.log('Successfully authenticated');
        const junitySettings = await settings.load("junity:settings");
        junitySettings.set('unityCatalogToken', loginResponse.access_token);
      } catch (error) {
        console.error('Failed to log in to Unity Catalog:', error);
      }
    } else {
      console.error('Google Auth Response is missing credential:', response);
    }
  };

  return (
    <div>
      {googleAuthEnabled && token === 'not-set' ? (
        <GoogleOAuthProvider clientId={googleClientId}>
          <GoogleLogin onSuccess={handleGoogleSignIn} />
        </GoogleOAuthProvider>
      ) : (
        <CatalogTree notebookTracker={notebookTracker} apiClient={apiClient} token={token} />
      )}
    </div>
  );
};

export class CatalogTreeWidget extends ReactWidget {
  private notebookTracker: INotebookTracker;
  public hostUrl: string;
  private token: string;
  public authenticated: boolean;
  private googleAuthEnabled: boolean = false;
  private googleClientId: string = '';
  private settings: ISettingRegistry;

  constructor(
    notebookTracker: INotebookTracker,
    hostUrl: string,
    token: string,
    googleAuthEnabled: boolean,
    googleClientId: string,
    settings: ISettingRegistry
  ) {
    super();
    this.notebookTracker = notebookTracker;
    this.hostUrl = hostUrl;
    this.token = token;
    this.authenticated = false;
    this.googleAuthEnabled = googleAuthEnabled;
    this.googleClientId = googleClientId;
    this.settings = settings;
    this.id = 'catalog-tree-widget';
    this.title.closable = true;
    this.addClass('jp-CatalogTreeWidget');
  }

  updateHostUrl(hostUrl: string) {
    this.hostUrl = hostUrl;
    this.update();
  }

  updateToken(token: string) {
    this.token = token;
    this.update();
  }

  updateAuthenticationEnabled(googleAuthEnabled: boolean) {
    this.googleAuthEnabled = googleAuthEnabled;
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

  render() {
    return (
      <QueryClientProvider client={queryClient}>
      <CatalogTreeWidgetComponent
        notebookTracker={this.notebookTracker}
        hostUrl={this.hostUrl}
        token={this.token}
        googleAuthEnabled={this.googleAuthEnabled}
        googleClientId={this.googleClientId}
        settings={this.settings}
        authenticated={this.authenticated}
        setAuthenticated={(authenticated) => this.setAuthenticated(authenticated)}
      />
      </QueryClientProvider>

    );
  }
}