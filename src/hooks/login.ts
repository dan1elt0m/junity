import { useContext } from 'react';
import { ClientContext } from '../context/client';
import { useMutation } from '@tanstack/react-query';
import { UC_AUTH_API_PREFIX } from '../utils/constants';

interface LoginResponse {
  access_token: string;
}

export function useLoginWithToken() {
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
