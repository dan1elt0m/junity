import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid2 as Grid, Divider, Button } from '@mui/material';
import { useListSchemas } from '../../hooks/schema';
import { useDeleteCatalog } from '../../hooks/catalog';
import ListSchema from './ListSchema';
import { CatalogInterface, SchemaInterface } from '../../types/interfaces';
import '../../../style/tree.css';

interface CatalogDetailsProps {
  catalog: CatalogInterface;
  onSchemaClick: (schema: SchemaInterface) => void;
}

const CatalogDetails: React.FC<CatalogDetailsProps> = ({
  catalog,
  onSchemaClick,
}) => {
  const [schemas, setSchemas] = useState<SchemaInterface[]>([]);
  const listSchemasRequest = useListSchemas({ catalog: catalog.name });
  const deleteCatalogMutation = useDeleteCatalog();

  useEffect(() => {
    if (listSchemasRequest.data?.schemas) {
      setSchemas(listSchemasRequest.data.schemas);
    }
  }, [listSchemasRequest.data?.schemas]);

  const handleDeleteCatalog = () => {
    if (confirm(`Are you sure you want to delete catalog ${catalog.name}?`)) {
      console.log('Deleting catalog: ', catalog.name);
      deleteCatalogMutation.mutate({ name: catalog.name });
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Button
        variant="contained"
        color="primary"
        sx={{ position: 'absolute', top: 16, right: 16, backgroundColor: 'blue' }}
        onClick={handleDeleteCatalog}
        disabled={deleteCatalogMutation.status === 'pending'}
      >
        Delete
      </Button>
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
        <Typography variant="h5" gutterBottom>
          Schemas
        </Typography>
        <ListSchema schemas={schemas} onSchemaClick={onSchemaClick} />
      </Box>
    </Box>
  );
};

export default CatalogDetails;