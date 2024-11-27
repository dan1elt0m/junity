import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid2 as Grid, Divider, Button, Modal, CircularProgress } from '@mui/material';
import { useListSchemas } from '../../hooks/schema';
import { useDeleteCatalog, useListCatalogs } from '../../hooks/catalog';
import ListSchema from './ListSchema';
import UpdateCatalogForm from '../../components/modals/UpdateCatalog';
import { CatalogInterface, SchemaInterface } from '../../types/interfaces';
import '../../../style/tree.css';
import CreateSchemaForm from '../../components/modals/CreateSchema';

interface CatalogDetailsProps {
  catalog: CatalogInterface;
  onSchemaClick: (schema: SchemaInterface) => void;
}

const CatalogDetails: React.FC<CatalogDetailsProps> = ({ catalog, onSchemaClick }) => {
  const [schemas, setSchemas] = useState<SchemaInterface[]>([]);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const listSchemasRequest = useListSchemas({ catalog: catalog.name });
  const listCatalogsRequest = useListCatalogs();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const deleteCatalogMutation = useDeleteCatalog();

  useEffect(() => {
    if (listSchemasRequest.data?.schemas) {
      setSchemas(listSchemasRequest.data.schemas);
    }
  }, [listSchemasRequest.data?.schemas]);

const handleDeleteCatalog = () => {
  if (confirm(`Are you sure you want to delete catalog ${catalog.name}?`)) {
    deleteCatalogMutation.mutate(
      { name: catalog.name },
      {
        onSuccess: () => {
          listCatalogsRequest.refetch();
        },
      }
    );
  }
};

  return (
    <Box sx={{ padding: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, marginBottom: 2 }}>
      <Button
        variant="contained"
        color="warning"
        onClick={handleDeleteCatalog}
        disabled={deleteCatalogMutation.status === 'pending'}
      >
        Delete
      </Button>
      <Button
        variant="contained"
        color="info"
        onClick={() => setShowUpdateForm(true)}
      >
        Update
      </Button>

  </Box>
      {deleteCatalogMutation.status === 'pending' && (
        <CircularProgress />
      )}
      {deleteCatalogMutation.isError && (
        <Typography color="error">
          {deleteCatalogMutation.error?.message || 'Failed to delete catalog'}
        </Typography>
      )}
      {deleteCatalogMutation.isError && (
        <Typography color="error">
          {deleteCatalogMutation.error?.message || 'Failed to delete catalog'}
        </Typography>
      )}

      <Typography variant="h4" gutterBottom>
        <span className="jp-icon-catalog"></span> {catalog.name}
      </Typography>
      <Divider sx={{ marginBottom: 2 }} />

      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="h5" gutterBottom>
          Overview
        </Typography>
        <Grid container spacing={2}>
          <Grid size={6}>
            <Typography variant="body1">
              <strong>Name:</strong> {catalog.name}
            </Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="body1">
              <strong>Owner:</strong> {catalog.owner || 'N/A'}
            </Typography>
          </Grid>
          <Grid size={12}>
            <Typography variant="body1">
              <strong>Comment:</strong> {catalog.comment}
            </Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="body1">
              <strong>ID:</strong> {catalog.id}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Divider />

      <Box sx={{ marginTop: 2 }}>
        <Typography variant="h5" gutterBottom>
          Details
        </Typography>
        <Grid container spacing={2}>
          <Grid size={6}>
            <Typography variant="body1">
              <strong>Created At:</strong>{' '}
              {new Date(catalog.created_at).toLocaleString()}
            </Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="body1">
              <strong>Updated At:</strong>{' '}
              {catalog.updated_at
                ? new Date(catalog.updated_at).toLocaleString()
                : 'N/A'}
            </Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="body1">
              <strong>Created By:</strong> {catalog.created_by || 'N/A'}
            </Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="body1">
              <strong>Updated By:</strong> {catalog.updated_by || 'N/A'}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Divider />

  <Box sx={{ marginTop: 2 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
      <Typography variant="h5" gutterBottom>
        Schemas List
      </Typography>
      <Button variant="contained" color="primary" onClick={() => setShowCreateForm(true)}>
        Create Schema
      </Button>
    </Box>
    <ListSchema schemas={schemas} onSchemaClick={onSchemaClick} />
  </Box>

      <Modal open={showUpdateForm} onClose={() => setShowUpdateForm(false)}>
        <Box sx={{ padding: 2, backgroundColor: 'white', margin: 'auto', marginTop: '10%', width: '50%' }}>
          <UpdateCatalogForm
            catalog={catalog}
            onSuccess={() => setShowUpdateForm(false)}
            onBack={() => setShowUpdateForm(false)}
          />
        </Box>
      </Modal>

      <Modal open={showCreateForm} onClose={() => setShowCreateForm(false)}>
        <Box sx={{ padding: 2, backgroundColor: 'white', margin: 'auto', marginTop: '10%', width: '50%' }}>
          <CreateSchemaForm
            catalog={catalog.name}
           onSuccess={() => {
              setShowCreateForm(false);
              listSchemasRequest.refetch();
            }}
            onBack={() => setShowCreateForm(false)}
          />
        </Box>
      </Modal>

    </Box>
  );
};

export default CatalogDetails;