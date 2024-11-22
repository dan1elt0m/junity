import { useQuery } from '@tanstack/react-query';
import { UC_AUTH_API_PREFIX } from '../utils/constants';
import { ClientContext } from '../context/client';
import { useContext } from 'react';

export interface UserInterface {
  id: string;
  userName: string;
  displayName: string;
  emails: any;
  photos: any;
}

export function useGetCurrentUser(access_token: string) {
  const apiClient = useContext(ClientContext);
  return useQuery<UserInterface>({
    queryKey: ['getUser', access_token],
    queryFn: async () => {
      return apiClient
        .get(`${UC_AUTH_API_PREFIX}/scim2/Users/self`, {
        })
        .then((response) => response.data)
        .catch((e) => {
          throw new Error(`Failed to fetch user. Error ${e}`);
        });
    },
  });
}