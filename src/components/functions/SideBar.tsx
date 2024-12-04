import React, { useRef, useState } from 'react';
import { Box, IconButton, Paper } from '@mui/material';
import {
  CatalogInterface,
  Entity,
  SchemaInterface,
  TableInterface
} from '../../types/interfaces';
import ExplorerComponent from './CatalogExplorer';
import CatalogTree from '../tree/CatalogTree';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';

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

  console.log('Selected sidebar item: ', selectedItem);

  return (
    <Paper
      elevation={3}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        height: '100vh',
        width: '100%'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          borderRight: '1px solid #ccc',
          flexDirection: 'column',
          justifyContent: 'top',
          alignItems: 'top',
          padding: 0,
          backgroundColor: 'white'
        }}
      >
        <IconButton
          onClick={() => handleSelectionChange('explorer')}
          aria-label="explorer-button"
          color="inherit"
          title={'Open catalog explorer'}
          sx={{
            '&:hover': {
              color: 'primary.main'
            }
          }}
        >
          <LocalLibraryIcon />
        </IconButton>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexGrow: 1,
          overflowY: 'auto'
        }}
      >
        <ExplorerComponent ref={explorerRef} />
        <CatalogTree onExploreClick={handleExplore} />
      </Box>
    </Paper>
  );
};

export default SideBar;
