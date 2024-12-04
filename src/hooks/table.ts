import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions
} from '@tanstack/react-query';
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
  const queryClient = useQueryClient();

  const query = useQuery<ListTablesResponse>({
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

  return {
    ...query,
    invalidateQueries: (catalog: string, schema: string) => {
      queryClient.invalidateQueries({
        queryKey: ['listTables', catalog, schema]
      });
    },
    refetch: async (catalog: string, schema: string) => {
      console.log('Refetching tables for catalog:', catalog, 'schema:', schema);
      const searchParams = new URLSearchParams({
        catalog_name: catalog,
        schema_name: schema
      });
      const response = await apiClient.get(
        `${UC_API_PREFIX}/tables?${searchParams.toString()}`
      );
      return response.data;
    }
  };
}

interface DeleteTableParams {
  catalog: string;
  schema: string;
}

export function useDeleteTable({ catalog, schema }: DeleteTableParams) {
  const queryClient = useQueryClient();
  const apiClient = useContext(ClientContext);

  return useMutation<
    void,
    Error,
    Pick<TableInterface, 'catalog_name' | 'schema_name' | 'name'>
  >({
    mutationFn: async ({ catalog_name, schema_name, name }): Promise<void> => {
      return apiClient
        .delete(
          `${UC_API_PREFIX}/tables/${catalog_name}.${schema_name}.${name}`
        )
        .then(response => response.data)
        .catch(e => {
          throw new Error(
            e.response?.data?.message || 'Failed to delete table'
          );
        });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['listTables', catalog, schema]
      });
    }
  });
}
