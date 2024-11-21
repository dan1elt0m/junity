import { ReactWidget } from '@jupyterlab/ui-components';
import { INotebookTracker } from '@jupyterlab/notebook';
import {
  GoogleOAuthProvider,
  GoogleLogin,
  CredentialResponse
} from '@react-oauth/google';
import CatalogTree from '../components/catalogTree';
import * as React from 'react';
import { getClient } from '../context/client';
import {
  QueryClient,
  QueryClientProvider,
  useMutation
} from '@tanstack/react-query';
import { UC_AUTH_API_PREFIX } from '../utils/constants';
import Cookies from 'js-cookie';
import { ClientContext } from '../context/client';
import { useContext } from 'react';
import { NotebookTrackerContext } from '../context/notebookTracker';
import AuthContext from '../context/auth';

const queryClient = new QueryClient();

interface LoginResponse {
  access_token: string;
}

function useLoginWithToken() {
  const apiClient = useContext(ClientContext);
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
        const response = await apiClient.post(
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

export const CatalogTreeWidgetComponent: React.FC<{
  googleAuthEnabled: boolean;
  googleClientId: string;
  setAuthenticated: (authenticated: boolean) => void;
  updateToken: (token: string) => void;
}> = ({ googleAuthEnabled, googleClientId, setAuthenticated, updateToken }) => {
  const loginWithToken = useLoginWithToken();

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
    console.log('Failed to log in to Unity Catalog:', error);
  };

  const authContext = useContext(AuthContext);

  return (
    <div>
      {googleAuthEnabled &&
      !authContext.authenticated &&
      !authContext.accessToken ? (
        <GoogleOAuthProvider clientId={googleClientId}>
          <GoogleLogin
            onSuccess={handleGoogleSignIn}
            onError={handleGoogleSignInError}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            containerProps={{ allow: 'identity-credentials-get' }}
            use_fedcm_for_prompt
            useOneTap={true}
          />
        </GoogleOAuthProvider>
      ) : (
        <CatalogTree />
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
    token: string,
    googleAuthEnabled: boolean,
    googleClientId: string
  ) {
    super();
    this.notebookTracker = notebookTracker;
    this.hostUrl = hostUrl;
    this.authenticated = false;
    this.token = Cookies.get('access_token') || token;
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
              <CatalogTreeWidgetComponent
                googleAuthEnabled={this.googleAuthEnabled}
                googleClientId={this.googleClientId}
                setAuthenticated={authenticated =>
                  this.setAuthenticated(authenticated)
                }
                updateToken={(token: string) => this.updateToken(token)}
              />
            </QueryClientProvider>
          </ClientContext.Provider>
        </NotebookTrackerContext.Provider>
      </AuthContext.Provider>
    );
  }
}
