import { ReactWidget } from '@jupyterlab/ui-components';
import { INotebookTracker } from '@jupyterlab/notebook';
import {
  GoogleOAuthProvider,
  GoogleLogin,
  CredentialResponse
} from '@react-oauth/google';
import CatalogTree from './catalogTree';
import * as React from 'react';
import { getClient } from './client';
import { AxiosInstance } from 'axios';
import {
  QueryClient,
  QueryClientProvider,
  useMutation
} from '@tanstack/react-query';
import { UC_AUTH_API_PREFIX } from './constants';
import Cookies from 'js-cookie';

const queryClient = new QueryClient();

interface LoginResponse {
  access_token: string;
}

function useLoginWithToken(client: AxiosInstance) {
  return useMutation<LoginResponse, Error, string>({
    mutationFn: async idToken => {
      const params = {
        grantType: 'urn:ietf:params:oauth:grant-type:token-exchange',
        requestedTokenType: 'urn:ietf:params:oauth:token-type:access_token',
        subjectTokenType: 'urn:ietf:params:oauth:token-type:id_token',
        subjectToken: idToken
      };
      console.log('Requesting token exchange with UC');
      try {
        const response = await client.post(
          `${UC_AUTH_API_PREFIX}/auth/tokens`,
          JSON.stringify(params),
          {}
        );
        return response.data;
      } catch {
        console.error('Error during token exchange with UC');
      }
    }
  });
}

const CatalogTreeWidgetComponent: React.FC<{
  notebookTracker: INotebookTracker;
  hostUrl: string;
  googleAuthEnabled: boolean;
  googleClientId: string;
  authenticated: boolean;
  setAuthenticated: (authenticated: boolean) => void;
  token: string;
  updateToken: (token: string) => void;
}> = ({
  notebookTracker,
  hostUrl,
  googleAuthEnabled,
  googleClientId,
  authenticated,
  setAuthenticated,
  token,
  updateToken
}) => {
  const apiClient = getClient(hostUrl);
  const loginWithToken = useLoginWithToken(apiClient);

  React.useEffect(() => {
    const authCookie = Cookies.get('authenticated');
    if (authCookie === 'true') {
      setAuthenticated(true);
    }
  }, [setAuthenticated]);

  React.useEffect(() => {
    const tokenCookie = Cookies.get('access_token');
    if (tokenCookie) {
      updateToken(tokenCookie);
    }
  }, [updateToken]);

  const handleGoogleSignIn = async (response: CredentialResponse) => {
    console.log('Handling Google Sign In response');
    if (response && response.credential) {
      console.log('Received Google Sign In credential');
      try {
        const loginResponse = await loginWithToken.mutateAsync(
          response.credential
        );

        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        console.log('Cookie expires at:', expiresAt);

        // Set the authenticated state
        Cookies.set('authenticated', 'true', {
          expires: expiresAt
        });
        Cookies.set('access_token', loginResponse.access_token, {
          expires: expiresAt,
          secure: true,
          sameSite: 'strict'
        });
        updateToken(loginResponse.access_token);
        setAuthenticated(true);
        console.log('Successfully authenticated');
      } catch (error) {
        console.error('Failed to log in to Unity Catalog:', error);
      }
    } else {
      console.error('Google Auth Response is missing credential:', response);
    }
  };

  const handleGoogleSignInError = (error: void) => {
    console.error('Failed to log in to Unity Catalog:', error);
  };

  return (
    <div>
      {googleAuthEnabled && !authenticated ? (
        <GoogleOAuthProvider clientId={googleClientId}>
          <GoogleLogin
            onSuccess={handleGoogleSignIn}
            onError={handleGoogleSignInError}
          />
        </GoogleOAuthProvider>
      ) : (
        <CatalogTree
          notebookTracker={notebookTracker}
          apiClient={apiClient}
          token={token}
        />
      )}
    </div>
  );
};

export class CatalogTreeWidget extends ReactWidget {
  private notebookTracker: INotebookTracker;
  public hostUrl: string;
  public authenticated: boolean;
  private googleAuthEnabled: boolean = false;
  private googleClientId: string = '';
  private token: string;

  constructor(
    notebookTracker: INotebookTracker,
    hostUrl: string,
    googleAuthEnabled: boolean,
    googleClientId: string
  ) {
    super();
    this.notebookTracker = notebookTracker;
    this.hostUrl = hostUrl;
    this.authenticated = false;
    this.token = Cookies.get('access_token') || '';
    this.googleAuthEnabled = googleAuthEnabled;
    this.googleClientId = googleClientId;
    this.id = 'catalog-tree-widget';
    this.title.closable = true;
    this.addClass('jp-CatalogTreeWidget');
  }

  updateHostUrl(hostUrl: string) {
    this.hostUrl = hostUrl;
    this.update();
  }

  updateAuthenticationEnabled(googleAuthEnabled: boolean) {
    this.googleAuthEnabled = googleAuthEnabled;
    this.update();
  }

  updateToken(token: string) {
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

  render() {
    return (
      <QueryClientProvider client={queryClient}>
        <CatalogTreeWidgetComponent
          notebookTracker={this.notebookTracker}
          hostUrl={this.hostUrl}
          googleAuthEnabled={this.googleAuthEnabled}
          googleClientId={this.googleClientId}
          authenticated={this.authenticated}
          setAuthenticated={authenticated =>
            this.setAuthenticated(authenticated)
          }
          token={this.token}
          updateToken={(token: string) => this.updateToken(token)}
        />
      </QueryClientProvider>
    );
  }
}
