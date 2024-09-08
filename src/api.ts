const BASE_URL = 'http://localhost:8081/api/2.1/unity-catalog';

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
export async function fetchCatalogs() {
  const response = await fetch(`${BASE_URL}/catalogs`, {
    method: 'GET',
    mode: 'cors'
  });
  if (!response.ok) {
    throw new Error('Failed to fetch catalogs');
  }
  const data = await response.json();
  if (!Array.isArray(data.catalogs)) {
    throw new Error('Expected an array of catalogs');
  }
  return data.catalogs;
}

/**
 * Fetch the schemas for a given catalog.
 */
export async function fetchSchemas(catalogName: string) {
  const response = await fetch(
    `${BASE_URL}/schemas?catalog_name=${catalogName}`,
    {
      method: 'GET',
      mode: 'cors'
    }
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch schemas for catalog ${catalogName}`);
  }
  const data = await response.json();
  if (!Array.isArray(data.schemas)) {
    throw new Error('Expected an array of schemas');
  }
  return data.schemas;
}

/**
 * Fetch the tables for a given catalog and schema.
 */
export async function fetchTables(catalogName: string, schemaName: string) {
  const response = await fetch(
    `${BASE_URL}/tables?catalog_name=${catalogName}&schema_name=${schemaName}`,
    {
      method: 'GET',
      mode: 'cors'
    }
  );
  if (!response.ok) {
    throw new Error(
      `Failed to fetch tables for catalog ${catalogName} and schema ${schemaName}`
    );
  }
  const data = await response.json();
  if (!Array.isArray(data.tables)) {
    throw new Error('Expected an array of tables');
  }
  return data.tables.map((table: ITable) => ({
    ...table,
    catalogName,
    schemaName
  }));
}