import axios from 'axios';

export function getClient(hostUrl: string) {
  return axios.create({
    baseURL: hostUrl,
    headers: {
      'Content-type': 'application/json'
    }
  });
}
