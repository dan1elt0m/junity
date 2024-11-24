export interface CatalogInterface {
  id: string;
  name: string;
  comment: string;
  created_at: number;
  updated_at: number | null;
  owner: string | null;
  created_by: string | null;
  updated_by: string | null;
}

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

export interface ColumnInterface {
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
  storage_location: string;
  created_at: number;
  updated_at: number | null;
  data_source_format: string;
  columns: ColumnInterface[];
  owner: string | null;
  created_by: string | null;
  updated_by: string | null;
}
