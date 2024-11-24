import { useQuery } from '@tanstack/react-query';
import { UC_API_PREFIX } from '../config/constants';
import { ClientContext } from '../context/client';
import { useContext } from 'react';
import { CatalogInterface } from '../types/interfaces';

interface ListCatalogsResponse {
  catalogs: CatalogInterface[];
  next_page_token: string | null;
}

// Fetch the list of catalogs
export function useListCatalogs() {
  const apiClient = useContext(ClientContext);
  return useQuery<ListCatalogsResponse>({
    queryKey: ['listCatalogs'],
    queryFn: async () => {
      return apiClient
        .get(`${UC_API_PREFIX}/catalogs`)
        .then(response => response.data)
        .catch(e => {
          throw new Error(`Failed to fetch catalogs. Error ${e}`);
        });
    }
  });
}
