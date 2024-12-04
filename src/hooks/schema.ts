import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions
} from '@tanstack/react-query';
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
  const queryClient = useQueryClient();

  const query = useQuery<ListSchemasResponse>({
    queryKey: ['listSchemas', catalog],
    queryFn: async () => {
      if (!catalog) {
        throw new Error('Catalog name is required');
      }
      const searchParams = new URLSearchParams({ catalog_name: catalog });
      const response = await apiClient.get(
        `${UC_API_PREFIX}/schemas?${searchParams.toString()}`
      );
      return response.data;
    },
    ...options
  });

  return {
    ...query,
    invalidateQueries: (catalog: string) => {
      queryClient.invalidateQueries({ queryKey: ['listSchemas', catalog] });
    },
    refetch: async (catalogName: string) => {
      console.log('Refetching schemas for catalog:', catalogName);
      const searchParams = new URLSearchParams({ catalog_name: catalogName });
      const response = await apiClient.get(
        `${UC_API_PREFIX}/schemas?${searchParams.toString()}`
      );
      queryClient.setQueryData(['listSchemas', catalogName], {
        schemas: response.data.schemas
      });
      await queryClient.invalidateQueries({
        queryKey: ['listSchemas', catalog]
      });
      return response.data;
    }
  };
}

export function useCreateSchema() {
  const queryClient = useQueryClient();
  const apiClient = useContext(ClientContext);

  return useMutation<
    SchemaInterface,
    Error,
    Pick<SchemaInterface, 'name' | 'catalog_name' | 'comment'>
  >({
    mutationFn: async params => {
      return apiClient
        .post(`${UC_API_PREFIX}/schemas`, JSON.stringify(params))
        .then(response => response.data)
        .catch(e => {
          throw new Error(
            e.response?.data?.message || 'Failed to create schema'
          );
        });
    },
    onSuccess: schema => {
      queryClient.invalidateQueries({
        queryKey: ['listSchemas', schema.catalog_name]
      });
    }
  });
}

interface UpdateSchemaParams {
  catalog: string;
  schema: string;
}

export function useUpdateSchema({ catalog, schema }: UpdateSchemaParams) {
  const queryClient = useQueryClient();
  const apiClient = useContext(ClientContext);

  return useMutation<SchemaInterface, Error, Pick<SchemaInterface, 'comment'>>({
    mutationFn: async params => {
      const fullSchemaName = [catalog, schema].join('.');

      return apiClient
        .patch(
          `${UC_API_PREFIX}/schemas/${fullSchemaName}`,
          JSON.stringify(params)
        )
        .then(response => response.data)
        .catch(e => {
          throw new Error(
            e.response?.data?.message || 'Failed to update schema'
          );
        });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getSchema', catalog, schema]
      });
    }
  });
}

interface DeleteSchemaParams {
  catalog: string;
}

export function useDeleteSchema({ catalog }: DeleteSchemaParams) {
  const queryClient = useQueryClient();
  const apiClient = useContext(ClientContext);
  return useMutation<
    void,
    Error,
    Pick<SchemaInterface, 'catalog_name' | 'name'>
  >({
    mutationFn: async params => {
      return apiClient
        .delete(
          `${UC_API_PREFIX}/schemas/${params.catalog_name}.${params.name}`
        )
        .then(response => response.data)
        .catch(e => {
          throw new Error(
            e.response?.data?.message || 'Failed to delete schema'
          );
        });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['listSchemas', catalog]
      });
    }
  });
}
