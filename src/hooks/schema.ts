import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { UC_API_PREFIX } from '../utils/constants';
import { useContext } from 'react';
import { ClientContext } from '../context/client';

export interface SchemaInterface {
  schema_id: string;
  catalog_name: string;
  name: string;
  comment: string;
  created_at: number;
  updated_at: number | null;
  owner: string | null;
  created_by: string | null;
  updated_by: string | null;
}
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
