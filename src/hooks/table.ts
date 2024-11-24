import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { UC_API_PREFIX } from '../config/constants';
import { useContext } from 'react';
import { ClientContext } from '../context/client';
import { TableInterface } from '../types/interfaces';

interface ListTablesResponse {
  tables: TableInterface[];
  next_page_token: string | null;
}

interface ListTablesParams {
  catalog: string;
  schema: string;
  options?: Omit<UseQueryOptions<ListTablesResponse>, 'queryKey' | 'queryFn'>;
}

export function useListTables({ catalog, schema, options }: ListTablesParams) {
  const apiClient = useContext(ClientContext);
  return useQuery<ListTablesResponse>({
    queryKey: ['listTables', catalog, schema],
    queryFn: async () => {
      const searchParams = new URLSearchParams({
        catalog_name: catalog,
        schema_name: schema
      });

      return apiClient
        .get(`${UC_API_PREFIX}/tables?${searchParams.toString()}`)
        .then(response => response.data);
    },
    ...options
  });
}
