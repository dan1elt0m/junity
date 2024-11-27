import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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

export function useCreateCatalog() {
  const queryClient = useQueryClient();
  const apiClient = useContext(ClientContext);

  return useMutation<
    CatalogInterface,
    Error,
    Pick<CatalogInterface, 'name' | 'comment'>
  >({
    mutationFn: async params => {
      return apiClient
        .post(`${UC_API_PREFIX}/catalogs`, JSON.stringify(params))
        .then(response => response.data)
        .catch(e => {
          throw new Error(
            e.response?.data?.message || 'Failed to create catalog'
          );
        });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['listCatalogs']
      });
    }
  });
}

export function useUpdateCatalog(catalog: string) {
  const queryClient = useQueryClient();
  const apiClient = useContext(ClientContext);

  return useMutation<
    CatalogInterface,
    Error,
    Pick<CatalogInterface, 'comment'>
  >({
    mutationFn: async params => {
      return apiClient
        .patch(`${UC_API_PREFIX}/catalogs/${catalog}`, JSON.stringify(params))
        .then(response => response.data)
        .catch(e => {
          throw new Error(
            e.response?.data?.message || 'Failed to update catalog'
          );
        });
    },
    onSuccess: catalog => {
      queryClient.invalidateQueries({
        queryKey: ['getCatalog', catalog.name]
      });
    }
  });
}

export function useDeleteCatalog() {
  const queryClient = useQueryClient();
  const apiClient = useContext(ClientContext);
  return useMutation<void, Error, Pick<CatalogInterface, 'name'>>({
    mutationFn: async params => {
      return apiClient
        .delete(`${UC_API_PREFIX}/catalogs/${params.name}`)
        .then(response => response.data)
        .catch(e => {
          console.log('Failed to delete catalog: ', e);
          throw new Error(
            e.response?.data?.message || 'Failed to delete catalog'
          );
        });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['listCatalogs']
      });
    }
  });
}
