import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { UC_API_PREFIX } from '../utils/constants';
import { useContext } from 'react';
import { ClientContext } from '../context/client';

interface ColumnInterface {
  name: string;
  type_text: string;
  type_name: string;
  created_at: number;
}

export interface TableInterface {
  table_id: string;
  table_type: string;
  catalog_name: string;
  schema_name: string;
  name: string;
  comment: string;
  created_at: number;
  updated_at: number | null;
  data_source_format: string;
  columns: ColumnInterface[];
  owner: string | null;
  created_by: string | null;
  updated_by: string | null;
}
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
