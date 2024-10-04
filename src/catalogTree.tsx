import React, { useEffect, useState } from 'react';
import {
  fetchCatalogs,
  fetchSchemas,
  fetchTables,
  ICatalog,
  IColumn,
  ISchema,
  ITable
} from './api';
import '../style/index.css';
import { INotebookTracker } from '@jupyterlab/notebook';

const getColumnIconClass = (dataType: string): string => {
  switch (dataType) {
    case 'BOOLEAN':
    case 'BINARY':
      return 'jp-icon-boolean';
    case 'NULL':
    case 'USER_DEFINED_TYPE':
    case 'TABLE_TYPE':
      return 'jp-icon-other';
    case 'BYTE':
    case 'SHORT':
    case 'INT':
    case 'LONG':
    case 'FLOAT':
    case 'DOUBLE':
    case 'DECIMAL':
      return 'jp-icon-numeric';
    case 'DATE':
    case 'TIMESTAMP':
    case 'TIMESTAMP_NTZ':
    case 'INTERVAL':
      return 'jp-icon-temporal';
    case 'STRING':
    case 'CHAR':
      return 'jp-icon-string';
    case 'ARRAY':
    case 'STRUCT':
    case 'MAP':
      return 'jp-icon-complex';
    default:
      return 'jp-icon-default';
  }
};

const CatalogTree: React.FC<{
  notebookTracker: INotebookTracker;
  hostUrl: string;
  token: string;
}> = ({ notebookTracker, hostUrl, token }) => {
  const [catalogs, setCatalogs] = useState<ICatalog[]>([]);
  const [schemas, setSchemas] = useState<{ [key: string]: ISchema[] }>({});
  const [tables, setTables] = useState<{ [key: string]: ITable[] }>({});
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    new Set(['Catalogs'])
  );
  const [allExpanded, setAllExpanded] = useState<boolean>(false); // Track if all nodes are expanded

  useEffect(() => {
    const loadCatalogs = async () => {
      const catalogs = await fetchCatalogs(hostUrl, token);
      setCatalogs(catalogs);
    };
    loadCatalogs();
  }, []);

  const fetchAndSetSchemasAndTables = async (catalogs: ICatalog[]) => {
    const newSchemas: { [key: string]: ISchema[] } = {};
    const newTables: { [key: string]: ITable[] } = {};

    for (const catalog of catalogs) {
      const fetchedSchemas = await fetchSchemas(catalog.name, hostUrl, token);
      newSchemas[catalog.name] = fetchedSchemas;

      for (const schema of fetchedSchemas) {
        const schemaKey = `${catalog.name}/${schema.name}`;
        const fetchedTables = await fetchTables(
          catalog.name,
          schema.name,
          hostUrl,
          token
        );
        newTables[schemaKey] = fetchedTables;
      }
    }

    setSchemas(newSchemas);
    setTables(newTables);
  };

  const getAllNodeNames = (
    catalogs: ICatalog[],
    schemas: { [key: string]: ISchema[] },
    tables: { [key: string]: ITable[] }
  ): Set<string> => {
    const allNodeNames = new Set<string>(['Catalogs']); // Ensure the root node is included

    catalogs.forEach(catalog => {
      allNodeNames.add(catalog.name);
      if (schemas[catalog.name]) {
        schemas[catalog.name].forEach(schema => {
          allNodeNames.add(`${catalog.name}/${schema.name}`);
          if (tables[`${catalog.name}/${schema.name}`]) {
            tables[`${catalog.name}/${schema.name}`].forEach(table => {
              allNodeNames.add(`${table.name}`);
            });
          }
        });
      }
    });

    return allNodeNames;
  };

  const toggleExpandAllNodes = async () => {
    if (allExpanded) {
      setExpandedNodes(new Set(['Catalogs'])); // Collapse all nodes
    } else {
      await refreshData();
      const allNodeNames = getAllNodeNames(catalogs, schemas, tables);
      setExpandedNodes(allNodeNames); // Expand all nodes
    }
    setAllExpanded(!allExpanded);
  };

  const refreshData = async () => {
    const catalogs = await fetchCatalogs(hostUrl, token);
    setCatalogs(catalogs);
    await fetchAndSetSchemasAndTables(catalogs);
  };

  const insertPathToNotebook = (
    path: string,
    notebookTracker: INotebookTracker
  ) => {
    // Get the current notebook instance
    const current = notebookTracker.currentWidget;
    if (!current) {
      console.error('No active notebook found');
      return;
    }
    const notebook = current.content;

    // Get the current cell
    const currentCell = notebook.activeCell;
    if (!currentCell) {
      console.error('No active cell found');
      return;
    }

    // Get the current cell's editor
    const editor = currentCell.editor;
    if (!editor) {
      console.error('No editor found in the current cell');
      return;
    } // Check if replaceSelection is defined
    if (typeof editor.replaceSelection === 'function') {
      // Insert the path at the current cursor position
      editor.replaceSelection(path);
    } else {
      console.error('replaceSelection method is not available on the editor');
    }
  };

  const toggleNode = async (
    nodeName: string,
    type: 'catalog' | 'schema' | 'table' | 'root',
    parentName?: string
  ) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeName)) {
        newSet.delete(nodeName);
      } else {
        newSet.add(nodeName);
      }
      return newSet;
    });

    if (type === 'catalog' && !schemas[nodeName]) {
      const fetchedSchemas = await fetchSchemas(nodeName, hostUrl, token);
      setSchemas(prev => ({ ...prev, [nodeName]: fetchedSchemas }));
    }

    if (type === 'schema') {
      if (!parentName) {
        throw new Error('Parent name not found');
      }
      const schemaName = nodeName.split('/').pop();
      if (!schemaName) {
        throw new Error('Schema name not found');
      }
      if (!tables[nodeName]) {
        const fetchedTables = await fetchTables(
          parentName,
          schemaName,
          hostUrl,
          token
        );
        setTables(prev => ({ ...prev, [nodeName]: fetchedTables }));
      }
    }
  };

  const renderColumns = (
    columns: IColumn[],
    notebookTracker: INotebookTracker
  ) => (
    <ul>
      {columns.map(column => (
        <li key={column.name} className="column-name">
          <span className={getColumnIconClass(column.type_name)}></span>
          {column.name}
          <span
            className="jp-icon-insert"
            onClick={() => {
              insertPathToNotebook(column.name, notebookTracker);
            }}
          ></span>
        </li>
      ))}
    </ul>
  );

  const renderTables = (
    tables: ITable[],
    notebookTracker: INotebookTracker
  ) => (
    <ul>
      {tables.map(table => (
        <li key={table.name} className="tree-node">
          <div onClick={() => toggleNode(table.name, 'table')}>
            <span
              className={`jp-icon-expand ${expandedNodes.has(table.name) ? 'jp-icon-rotate' : ''}`}
            ></span>
            <span className="jp-icon-table"></span> {table.name}
            <span
              className="jp-icon-insert"
              onClick={e => {
                e.stopPropagation(); // Prevent triggering the toggleNode
                insertPathToNotebook(
                  `${table.catalogName}.${table.schemaName}.${table.name}`,
                  notebookTracker
                );
              }}
            ></span>
          </div>
          {expandedNodes.has(table.name) && (
            <ul>{renderColumns(table.columns, notebookTracker)}</ul>
          )}
        </li>
      ))}
    </ul>
  );
  const renderSchemas = (schemas: ISchema[], catalogName: string) => (
    <ul>
      {schemas.map(schema => (
        <li key={schema.name}>
          <div
            onClick={() =>
              toggleNode(`${catalogName}/${schema.name}`, 'schema', catalogName)
            }
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
                  notebookTracker
                )}
              </div>
            )}
        </li>
      ))}
    </ul>
  );

  const renderCatalogs = (notebookTracker: INotebookTracker) => (
    <ul>
      {catalogs.map(catalog => (
        <li key={catalog.name}>
          <div onClick={() => toggleNode(catalog.name, 'catalog')}>
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
      <button className="refresh-button" onClick={refreshData}></button>
      <button
        className={`expand-all-button ${allExpanded ? 'expand-all-button-rotate' : ''}`}
        onClick={toggleExpandAllNodes}
      ></button>
      <div>
        <span className="grey-font small-font margin-left">Catalogs</span>
      </div>
      {renderCatalogs(notebookTracker)}
    </div>
  );
};

export default CatalogTree;
