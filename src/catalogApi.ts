import { AxiosInstance } from 'axios';
import { UC_API_PREFIX } from './constants';

export interface ICatalog {
  name: string;
}

export interface ISchema {
  name: string;
  tables?: ITable[];
}

export interface ITable {
  name: string;
  columns: IColumn[];
  catalogName: string;
  schemaName: string;
}

export interface IColumn {
  name: string;
  type_name: string;
}

/**
 * Fetch the list of catalogs.
 */
export async function fetchCatalogs(apiClient: AxiosInstance, token: string) {
  const response = await apiClient.get(`${UC_API_PREFIX}/catalogs`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!Array.isArray(response.data.catalogs)) {
    throw new Error('Expected an array of catalogs');
  }
  return response.data.catalogs;
}

/**
 * Fetch the schemas for a given catalog.
 */
export async function fetchSchemas(
  apiClient: AxiosInstance,
  catalogName: string,
  token: string
) {
  const response = await apiClient.get(`${UC_API_PREFIX}/schemas`, {
    params: { catalog_name: catalogName },
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!Array.isArray(response.data.schemas)) {
    throw new Error('Expected an array of schemas');
  }
  return response.data.schemas;
}

/**
 * Fetch the tables for a given catalog and schema.
 */
export async function fetchTables(
  apiClient: AxiosInstance,
  catalogName: string,
  schemaName: string,
  token: string
) {
  const response = await apiClient.get(`${UC_API_PREFIX}/tables`, {
    params: { catalog_name: catalogName, schema_name: schemaName },
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!Array.isArray(response.data.tables)) {
    throw new Error('Expected an array of tables');
  }
  return response.data.tables.map((table: ITable) => ({
    ...table,
    catalogName,
    schemaName
  }));
}
