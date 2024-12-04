import React, { useState, useEffect, useMemo } from 'react';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useListTables } from '../../hooks/table';
import { useListCatalogs } from '../../hooks/catalog';
import { useListSchemas } from '../../hooks/schema';
import '../../../style/tree.css';

import {
  Entity,
  SchemaInterface,
  TableInterface
} from '../../types/interfaces';

import {
  CustomTreeItem,
  CustomTreeItemSlotProps
} from '../../style/catalog-tree';

export const CatalogTree: React.FC<{
  onExploreClick?: (entity: Entity) => void;
}> = ({ onExploreClick }) => {
  const [schemas, setSchemas] = useState<{ [key: string]: SchemaInterface[] }>(
    {}
  );
  const [tables, setTables] = useState<{ [key: string]: TableInterface[] }>({});
  const [entities, setEntities] = useState<{ [key: string]: Entity }>({});

  const listCatalogsRequest = useListCatalogs();
  const listSchemasRequest = useListSchemas({
    catalog: '',
    options: { enabled: false }
  });
  const listTablesRequest = useListTables({
    catalog: '',
    schema: '',
    options: { enabled: false }
  });

  useEffect(() => {
    const fetchSchemas = async (catalogName: string) => {
      const response = await listSchemasRequest.refetch(catalogName);
      if (response.schemas) {
        setSchemas(prev => ({
          ...prev,
          [catalogName]: response.schemas
        }));
        for (const schema of response.schemas) {
          const response = await listTablesRequest.refetch(
            catalogName,
            schema.name
          );
          if (response.tables) {
            setTables(prev => ({
              ...prev,
              [`${catalogName}.${schema.name}`]: response.tables
            }));
          }
        }
      }
    };

    const fetchAllChildren = async () => {
      if (listCatalogsRequest.data?.catalogs) {
        for (const catalog of listCatalogsRequest.data.catalogs) {
          await fetchSchemas(catalog.name);
        }
      }
    };

    fetchAllChildren();
  }, [listCatalogsRequest.data]);

  const treeItems = useMemo(() => {
    const treeItems: TreeViewBaseItem[] = [];

    listCatalogsRequest.data?.catalogs.forEach(catalog => {
      const catalogId = catalog.name;
      setEntities(prev => ({
        ...prev,
        [catalogId]: catalog
      }));
      const catalogSchemas = schemas[catalog.name] || [];
      const schemaItems = catalogSchemas.map(schema => {
        const schemaId = `${catalog.name}.${schema.name}`;
        setEntities(prev => ({
          ...prev,
          [schemaId]: schema
        }));
        const schemaTables = tables[schemaId] || [];
        const tableItems = schemaTables.map(table => {
          const tableId = `${catalog.name}.${schema.name}.${table.name}`;
          setEntities(prev => ({
            ...prev,
            [tableId]: table
          }));
          const columnItems = table.columns.map(column => {
            const columnId = `${catalog.name}.${schema.name}.${table.name}.${column.name}`;
            setEntities(prev => ({
              ...prev,
              [columnId]: column
            }));
            return {
              id: columnId,
              label: column.name
            };
          });
          return {
            id: tableId,
            label: `${table.name}`,
            labelIcon: 'jp-icon-table',
            children: columnItems
          };
        });
        return {
          id: schemaId,
          label: `${schema.name}`,
          children: tableItems
        };
      });

      treeItems.push({
        id: catalogId,
        label: catalog.name,
        children: schemaItems
      });
    });

    return treeItems;
  }, [listCatalogsRequest.data, schemas, tables, onExploreClick]);

  return (
    <RichTreeView
      items={treeItems}
      defaultExpandedItems={['1', '1.1']}
      defaultSelectedItems="1.1"
      sx={{
        height: 'fit-content',
        flexGrow: 1,
        maxWidth: 400,
        overflowY: 'auto'
      }}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      slots={{ item: CustomTreeItem as any }}
      slotProps={{
        item: {
          entities: entities,
          onExploreClick: onExploreClick,
          console: console
        } as CustomTreeItemSlotProps
      }}
    />
  );
};

export default CatalogTree;
