import React from 'react';
import {
  CatalogInterface,
  SchemaInterface,
  TableInterface
} from '../../types/interfaces';

interface ExplorerPanelProps {
  entity: CatalogInterface | SchemaInterface | TableInterface | null;
}

const ExplorerPanel: React.FC<ExplorerPanelProps> = ({ entity }) => {
  if (!entity) {
    return (
      <div className="explorer-panel">Select an entity to view details</div>
    );
  }

  const renderEntityDetails = () => {
    if ('schema_id' in entity) {
      // Render schema details
      return (
        <div>
          <h2>Schema: {entity.name}</h2>
          {/* Add more schema details here */}
        </div>
      );
    } else if ('table_id' in entity) {
      // Render table details
      return (
        <div>
          <h2>Table: {entity.name}</h2>
          {/* Add more table details here */}
        </div>
      );
    } else {
      // Render catalog details
      return (
        <div>
          <h2>Catalog: {entity.name}</h2>
          {/* Add more catalog details here */}
        </div>
      );
    }
  };

  return <div className="main-panel">{renderEntityDetails()}</div>;
};

export default ExplorerPanel;
