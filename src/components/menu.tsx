import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDatabase,
  faMagnifyingGlassChart
} from '@fortawesome/free-solid-svg-icons';
import CatalogTree from './catalogTree';
import '../../style/menu.css';

type Item = 'tree' | 'explorer' | 'none';

export const Menu: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<Item>('tree');

  const handleSelectionChange = (item: Item) => {
    setSelectedItem(item);
  };

  return (
    <div className="menu-container">
      <div className="selection-menu">
        <button
          onClick={() => handleSelectionChange('tree')}
          aria-label="tree-button"
        >
          <FontAwesomeIcon icon={faDatabase} name="tree-icon" />
        </button>
        <button
          onClick={() => handleSelectionChange('explorer')}
          aria-label="explorer-button"
        >
          <FontAwesomeIcon icon={faMagnifyingGlassChart} name="explorer-icon" />
        </button>
      </div>
      <div className="content-container">
        {selectedItem === 'tree' ? <CatalogTree /> : <div>Other Content</div>}
      </div>
    </div>
  );
};
