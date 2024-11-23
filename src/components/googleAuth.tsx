import React, { useEffect, useState } from 'react';
import {
  GoogleOAuthProvider,
  GoogleLogin,
  CredentialResponse
} from '@react-oauth/google';
import Cookies from 'js-cookie';
import { useLoginWithToken } from '../hooks/login';
import '../../style/auth.css';

interface AuthContainerProps {
  googleAuthEnabled: boolean;
  googleClientId: string;
  setAuthenticated: (authenticated: boolean) => void;
  updateToken: (token: string) => void;
}

export const GoogleAuth: React.FC<AuthContainerProps> = ({
  googleAuthEnabled,
  googleClientId,
  setAuthenticated,
  updateToken
}) => {
  const loginWithToken = useLoginWithToken();
  const [loginError, setLoginError] = useState(false);

  useEffect(() => {
    const authCookie = Cookies.get('authenticated');
    if (authCookie === 'true') {
      setAuthenticated(true);
    }
  }, [setAuthenticated]);

  useEffect(() => {
    const tokenCookie = Cookies.get('access_token');
    if (tokenCookie) {
      updateToken(tokenCookie);
    }
  }, [updateToken]);

  useEffect(() => {
    if (googleAuthEnabled && !googleClientId) {
      console.error(
        'Google authentication is enabled, but no client ID is set.'
      );
    }
  }, [googleAuthEnabled, googleClientId]);

  const handleGoogleSignIn = async (response: CredentialResponse) => {
    if (response && response.credential) {
      try {
        const loginResponse = await loginWithToken.mutateAsync(
          response.credential
        );
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        Cookies.set('authenticated', 'true', { expires: expiresAt });
        Cookies.set('access_token', loginResponse.access_token, {
          expires: expiresAt,
          secure: true,
          sameSite: 'strict'
        });
        updateToken(loginResponse.access_token);
        setAuthenticated(true);
      } catch (error) {
        console.error('Failed to log in to Unity Catalog:', error);
        setLoginError(true);
      }
    } else {
      console.error('Google Auth Response is missing credential:', response);
      setLoginError(true);
    }
  };

  const handleGoogleSignInError = (error: void) => {
    console.error('Failed to log in to Unity Catalog:', error);
    setLoginError(true);
  };

  return (
    <div className="container">
      {loginError && (
        <div className="error-message">
          Oops.. login failed, check console logs or contact your system
          administrator.
        </div>
      )}
      <div className="login-container">
        <GoogleOAuthProvider clientId={googleClientId}>
          <GoogleLogin
            onSuccess={handleGoogleSignIn}
            onError={handleGoogleSignInError}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            containerProps={{ allow: 'identity-credentials-get' }}
            use_fedcm_for_prompt
            useOneTap={true}
            className="login-button"
            aria-label="Sign in with Google"
          />
        </GoogleOAuthProvider>
      </div>
    </div>
  );
};
