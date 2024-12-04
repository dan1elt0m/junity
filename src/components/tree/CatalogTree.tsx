import React, { useState, useEffect, useMemo, useContext } from 'react';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useListTables } from '../../hooks/table';
import { useListCatalogs } from '../../hooks/catalog';
import { useListSchemas } from '../../hooks/schema';
import '../../../style/tree.css';
import RefreshIcon from '@mui/icons-material/Refresh';
import LogoutIcon from '@mui/icons-material/Logout';

import {
  Entity,
  SchemaInterface,
  TableInterface
} from '../../types/interfaces';

import {
  CustomTreeItem,
  CustomTreeItemSlotProps
} from '../../style/catalog-tree';
import { Box, IconButton } from '@mui/material';
import AuthContext, { LogoutContext } from '../../context/auth';

export const CatalogTree: React.FC<{
  onExploreClick?: (entity: Entity) => void;
}> = ({ onExploreClick }) => {
  const [schemas, setSchemas] = useState<{ [key: string]: SchemaInterface[] }>(
    {}
  );
  const [tables, setTables] = useState<{ [key: string]: TableInterface[] }>({});
  const [entities, setEntities] = useState<{ [key: string]: Entity }>({});
  const [refreshKey, setRefreshKey] = useState(0);
  const authContext = useContext(AuthContext);
  const logoutContext = useContext(LogoutContext);

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
  }, [listCatalogsRequest.data, refreshKey]);

  const handleRefresh = async () => {
    setRefreshKey(prevKey => prevKey + 1);
    await listCatalogsRequest.refetch();
  };

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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: 0,
          height: '30px',
          borderBottom: '1px solid #ccc',
          gap: 0
        }}
      >
        <IconButton
          onClick={handleRefresh}
          aria-label="refresh-button"
          color="inherit"
          title={'Refresh catalog'}
          sx={{
            marginRight: 0,
            '&:hover': {
              color: 'primary.main'
            }
          }}
        >
          <RefreshIcon width={10} height={10} />
        </IconButton>
        {authContext.authenticated && (
          <IconButton
            onClick={logoutContext.logout}
            aria-label="logout-button"
            title="Logout"
            color="inherit"
            sx={{
              marginRight: 0,
              '&:hover': {
                color: 'primary.main'
              }
            }}
          >
            <LogoutIcon width={10} height={10} />
          </IconButton>
        )}
      </Box>
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
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
      </Box>
    </Box>
  );
};

export default CatalogTree;
