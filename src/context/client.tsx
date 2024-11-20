import axios from 'axios';
import { createContext } from 'react';

export function getClient(hostUrl: string, token: string) {
  return axios.create({
    baseURL: hostUrl,
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });
}

export const ClientContext = createContext(
  getClient('http://localhost:8080', '')
);
