import React, { useEffect, useState } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import ListCatalogs from './ListCatalogs';
import { useListCatalogs } from '../../hooks/catalog';
import { CatalogInterface } from '../../types/interfaces';

interface ExplorerDetailsProps {
  onCatalogClick: (catalog: CatalogInterface) => void;
}
const ExplorerDetails: React.FC<ExplorerDetailsProps> = ({
  onCatalogClick
}) => {
  const { data, error, isLoading } = useListCatalogs();
  const [catalogs, setCatalogs] = useState<CatalogInterface[]>([]);

  useEffect(() => {
    if (data?.catalogs) {
      setCatalogs(data.catalogs);
    }
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching catalogs: {error.message}</div>;
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to the Catalog Explorer
      </Typography>
      <Divider sx={{ marginBottom: 2 }} />
      <Typography variant="h5" gutterBottom>
        Available Catalogs
      </Typography>
      <ListCatalogs catalogs={catalogs} onCatalogClick={onCatalogClick} />
    </Box>
  );
};

export default ExplorerDetails;
