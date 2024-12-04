import React, { useEffect, useState } from 'react';
import {
  GoogleOAuthProvider,
  GoogleLogin,
  CredentialResponse
} from '@react-oauth/google';
import Cookies from 'js-cookie';
import { useLoginWithToken } from '../../hooks/login';
import { Box, Container, Alert } from '@mui/material';

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
  const isLocalhost =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1';

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
          secure: !isLocalhost,
          sameSite: 'Strict',
          httpOnly: !isLocalhost
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
    <Container maxWidth="sm">
      {loginError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Login failed, check console logs or contact your system administrator.
        </Alert>
      )}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={3}
        border={1}
        borderColor="grey.300"
        borderRadius={2}
        boxShadow={3}
        bgcolor="background.paper"
      >
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
      </Box>
    </Container>
  );
};
