import React, { useContext, useEffect, useState } from 'react';
import '../../style/index.css';
import Cookies from 'js-cookie';
import { useListCatalogs } from '../hooks/catalog';
import { SchemaInterface, useListSchemas } from '../hooks/schema';
import { getColumnIconClass } from '../utils/columnIcons';
import { insertEntityToNotebook } from '../notebook/insertEntity';
import { TableInterface, useListTables } from '../hooks/table';
import { ColumnInterface } from '../hooks/column';
import { NotebookTrackerContext } from '../context/notebookTracker';
import AuthContext from '../context/auth';
import { googleLogout } from '@react-oauth/google';

// Renders the catalog tree
export const CatalogTree: React.FC<unknown> = () => {
  const notebookTracker = useContext(NotebookTrackerContext);
  const authContext = useContext(AuthContext);
  const [catalogToExpand, setCatalogToExpand] = useState<string>();
  const [schemaToExpand, setSchemaToExpand] = useState<string>();
  const [schemas, setSchemas] = useState<{ [key: string]: SchemaInterface[] }>(
    {}
  );
  const [tables, setTables] = useState<{ [key: string]: TableInterface[] }>({});
  const [allExpanded, setAllExpanded] = useState<boolean>(false);
  const listCatalogsRequest = useListCatalogs();
  const listSchemasRequest = useListSchemas({
    catalog: catalogToExpand!,
    options: { enabled: !!catalogToExpand }
  });
  const listTablesRequest = useListTables({
    catalog: catalogToExpand!,
    schema: schemaToExpand!,
    options: { enabled: !!schemaToExpand }
  });

  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    new Set(['Catalogs'])
  );

  useEffect(() => {
    if (listSchemasRequest.data?.schemas) {
      setSchemas(prev => ({
        ...prev,
        [catalogToExpand!]: listSchemasRequest.data.schemas
      }));
    }
  }, [catalogToExpand, listSchemasRequest.data?.schemas]);

  useEffect(() => {
    if (listTablesRequest.data?.tables) {
      setTables(prev => ({
        ...prev,
        [`${catalogToExpand}/${schemaToExpand}`]: listTablesRequest.data.tables
      }));
    }
  }, [schemaToExpand, listTablesRequest.data?.tables]);

  const handleLogout = () => {
    Cookies.remove('authenticated');
    Cookies.remove('access_token');
    googleLogout();
    window.location.reload();
  };
  const toggleExpandAllNodes = async () => {
    // TODO: if nodes have not yet been expanded, fetch the data first
    if (allExpanded) {
      setExpandedNodes(new Set(['Catalogs'])); // Collapse all nodes
    } else {
      const allNodeNames = new Set<string>();
      listCatalogsRequest.data?.catalogs.forEach(catalog => {
        allNodeNames.add(catalog.name);
        schemas[catalog.name]?.forEach(schema => {
          allNodeNames.add(`${catalog.name}/${schema.name}`);
          tables[`${catalog.name}/${schema.name}`]?.forEach(table => {
            allNodeNames.add(`${catalog.name}/${schema.name}/${table.name}`);
          });
        });
      });
      setExpandedNodes(allNodeNames); // Expand all nodes
    }
    setAllExpanded(!allExpanded);
  };

  const toggleNode = (nodeName: string) => {
    const newSet = new Set(expandedNodes);
    if (newSet.has(nodeName)) {
      newSet.delete(nodeName);
    } else {
      newSet.add(nodeName);
    }
    setExpandedNodes(newSet);
  };

  const renderColumns = (columns: ColumnInterface[]) => (
    <ul>
      {columns.map(column => (
        <li key={column.name} className="column-name">
          <span className={getColumnIconClass(column.type_name)}></span>
          {column.name}
          <span
            className="jp-icon-insert"
            onClick={() => {
              insertEntityToNotebook(column.name, notebookTracker!);
            }}
          ></span>
        </li>
      ))}
    </ul>
  );

  const renderTables = (
    tables: TableInterface[],
    catalogName: string,
    schemaName: string
  ) => (
    <ul>
      {tables.map(table => (
        <li key={table.name} className="tree-node">
          <div
            onClick={() =>
              toggleNode(`${catalogName}/${schemaName}/${table.name}`)
            }
          >
            <span
              className={`jp-icon-expand ${expandedNodes.has(`${catalogName}/${schemaName}/${table.name}`) ? 'jp-icon-rotate' : ''}`}
            ></span>
            <span className="jp-icon-table"></span> {table.name}
            <span
              className="jp-icon-insert"
              onClick={e => {
                e.stopPropagation(); // Prevent triggering the toggleNode
                insertEntityToNotebook(
                  `${catalogName}.${schemaName}.${table.name}`,
                  notebookTracker!
                );
              }}
            ></span>
          </div>
          {expandedNodes.has(`${catalogName}/${schemaName}/${table.name}`) && (
            <ul>{renderColumns(table.columns)}</ul>
          )}
        </li>
      ))}
    </ul>
  );

  const renderSchemas = (schemas: SchemaInterface[], catalogName: string) => (
    <ul>
      {schemas.map(schema => (
        <li key={schema.name}>
          <div
            onClick={() => {
              toggleNode(`${catalogName}/${schema.name}`);
              setSchemaToExpand(schema.name);
            }}
          >
            <span
              className={`jp-icon-expand ${expandedNodes.has(`${catalogName}/${schema.name}`) ? 'jp-icon-rotate' : ''}`}
            ></span>
            <span className="jp-icon-schema"></span> {schema.name}
          </div>
          {expandedNodes.has(`${catalogName}/${schema.name}`) &&
            tables[`${catalogName}/${schema.name}`] && (
              <div>
                {renderTables(
                  tables[`${catalogName}/${schema.name}`],
                  catalogName,
                  schema.name
                )}
              </div>
            )}
        </li>
      ))}
    </ul>
  );

  const renderCatalogs = () => (
    <ul>
      {listCatalogsRequest.data?.catalogs.map(catalog => (
        <li key={catalog.name}>
          <div
            onClick={() => {
              toggleNode(catalog.name);
              setCatalogToExpand(catalog.name);
            }}
          >
            <span
              className={`jp-icon-expand ${expandedNodes.has(catalog.name) ? 'jp-icon-rotate' : ''}`}
            ></span>
            <span className="jp-icon-catalog"></span> {catalog.name}
          </div>
          {expandedNodes.has(catalog.name) && schemas[catalog.name] && (
            <div>{renderSchemas(schemas[catalog.name], catalog.name)}</div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <div style={{ position: 'relative' }}>
      <button
        className={`expand-all-button ${allExpanded ? 'expand-all-button-rotate' : ''}`}
        onClick={toggleExpandAllNodes}
        aria-label="expand-all"
        title={allExpanded ? 'Collapse all' : 'Expand all'}
      ></button>
      {authContext.authenticated && (
        <button
          className="logout-button"
          onClick={handleLogout}
          aria-label="logout"
          title="Logout"
        ></button>
      )}
      <div>
        <span className="grey-font small-font margin-left">Catalogs</span>
      </div>
      {renderCatalogs()}
    </div>
  );
};

export default CatalogTree;
