import React, { useRef, useState } from 'react';
import '../../../style/menu.css';
import {
  CatalogInterface,
  Entity,
  SchemaInterface,
  TableInterface
} from '../../types/interfaces';
import ExplorerComponent from './CatalogExplorer';
import CatalogTree from '../tree/CatalogTree';
import { catalogIcon } from '../../style/icons';

type Item = 'tree' | 'explorer' | 'none';

export const SideBar: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<Item>('tree');
  const explorerRef = useRef<{
    handleExploreClick: (entity: Entity) => void;
    openWidget: (
      type: 'catalog' | 'schema' | 'table' | 'frontpage',
      entity?: CatalogInterface | SchemaInterface | TableInterface
    ) => void;
  }>(null);

  const handleSelectionChange = (item: Item) => {
    setSelectedItem(item);
    if (item === 'explorer') {
      console.log('Opening explorer widget');
      explorerRef.current?.openWidget('frontpage');
    }
  };

  const handleExplore = (entity: Entity) => {
    explorerRef.current?.handleExploreClick(entity);
  };

  const iconSize = 16;

  console.log('Selected sidebar item: ', selectedItem);

  return (
    <div className="menu-container">
      <div className="selection-menu">
        <button
          onClick={() => handleSelectionChange('explorer')}
          aria-label="explorer-button"
        >
          <catalogIcon.react width={iconSize} height={iconSize} />
        </button>
      </div>
      <div className="content-container">
        <CatalogTree onExploreClick={handleExplore} />
      </div>
      <ExplorerComponent ref={explorerRef} />
    </div>
  );
};

export default SideBar;
