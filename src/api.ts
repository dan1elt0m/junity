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
export async function fetchCatalogs(hostUrl: string, token: string) {
  const response = await fetch(`${hostUrl}/catalogs`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      Authorization: `Bearer ${token}`
    }
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
export async function fetchSchemas(
  catalogName: string,
  hostUrl: string,
  token: string
) {
  const response = await fetch(
    `${hostUrl}/schemas?catalog_name=${catalogName}`,
    {
      method: 'GET',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${token}`
      }
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
export async function fetchTables(
  catalogName: string,
  schemaName: string,
  hostUrl: string,
  token: string
) {
  const response = await fetch(
    `${hostUrl}/tables?catalog_name=${catalogName}&schema_name=${schemaName}`,
    {
      method: 'GET',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${token}`
      }
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
