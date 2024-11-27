import React, { useEffect, useState } from 'react';
import { Box, Typography, Divider, Button, Modal } from '@mui/material';
import ListCatalogs from './ListCatalogs';
import CreateCatalogForm from '../../components/modals/CreateCatalog';
import { useListCatalogs } from '../../hooks/catalog';
import { CatalogInterface } from '../../types/interfaces';

interface ExplorerDetailsProps {
  onCatalogClick: (catalog: CatalogInterface) => void;
}

const ExplorerDetails: React.FC<ExplorerDetailsProps> = ({ onCatalogClick }) => {
  const { data, error, isLoading } = useListCatalogs();
  const [catalogs, setCatalogs] = useState<CatalogInterface[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

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
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <Button variant="contained" color="primary" onClick={() => setShowCreateForm(true)}>
          Create Catalog
        </Button>
      </Box>
      <Modal open={showCreateForm} onClose={() => setShowCreateForm(false)}>
        <Box sx={{ padding: 2, backgroundColor: 'white', margin: 'auto', marginTop: '10%', width: '50%' }}>
          <CreateCatalogForm
            onSuccess={() => setShowCreateForm(false)}
            onBack={() => setShowCreateForm(false)}
          />
        </Box>
      </Modal>
      <Typography variant="h5" gutterBottom sx={{ marginTop: 2 }}>
        Available Catalogs
      </Typography>
      <ListCatalogs catalogs={catalogs} onCatalogClick={onCatalogClick} />
    </Box>
  );
};

export default ExplorerDetails;