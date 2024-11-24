import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { UC_API_PREFIX } from '../config/constants';
import { useContext } from 'react';
import { ClientContext } from '../context/client';
import { SchemaInterface } from '../types/interfaces';

interface ListSchemasResponse {
  schemas: SchemaInterface[];
  next_page_token: string | null;
}

interface ListSchemasParams {
  catalog: string;
  options?: Omit<UseQueryOptions<ListSchemasResponse>, 'queryKey' | 'queryFn'>;
}

export function useListSchemas({ catalog, options }: ListSchemasParams) {
  const apiClient = useContext(ClientContext);
  return useQuery<ListSchemasResponse>({
    queryKey: ['listSchemas', catalog],
    queryFn: async () => {
      const searchParams = new URLSearchParams({ catalog_name: catalog });
      return apiClient
        .get(`${UC_API_PREFIX}/schemas?${searchParams.toString()}`)
        .then(response => response.data);
    },
    ...options
  });
}
