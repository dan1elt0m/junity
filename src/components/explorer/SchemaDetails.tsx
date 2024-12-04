import React, { useEffect, useState } from 'react';
import { useListTables } from '../../hooks/table';
import {
  Box,
  Typography,
  Grid2 as Grid,
  Divider,
  Button,
  Modal,
  CircularProgress
} from '@mui/material';
import ListTables from './ListTables';
import UpdateSchemaForm from '../../components/modals/UpdateSchema';
import { SchemaInterface, TableInterface } from '../../types/interfaces';
import { useDeleteSchema, useListSchemas } from '../../hooks/schema';

interface SchemaDetailsProps {
  schema: SchemaInterface;
  onTableClick: (table: TableInterface) => void;
}

const SchemaDetails: React.FC<SchemaDetailsProps> = ({
  schema,
  onTableClick
}) => {
  const [tables, setTables] = useState<TableInterface[]>([]);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const listTablesRequest = useListTables({
    catalog: schema.catalog_name,
    schema: schema.name
  });
  const listSchemasRequest = useListSchemas({ catalog: schema.catalog_name });
  const deleteSchemaMutation = useDeleteSchema({
    catalog: schema.catalog_name
  });

  useEffect(() => {
    if (listTablesRequest.data?.tables) {
      setTables(listTablesRequest.data.tables);
    }
  }, [listTablesRequest.data?.tables, schema.catalog_name]);

  const handleDeleteSchema = () => {
    if (confirm(`Are you sure you want to delete schema ${schema.name}?`)) {
      deleteSchemaMutation.mutate(
        { catalog_name: schema.catalog_name, name: schema.name },
        {
          onSuccess: async () => {
            await listSchemasRequest.refetch(schema.catalog_name);
          }
        }
      );
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2,
          marginBottom: 2
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ flexGrow: 1 }}>
          <span className="jp-icon-schema-explorer"></span>
          {schema.name}
        </Typography>
        <Button
          variant="contained"
          color="error"
          onClick={handleDeleteSchema}
          disabled={deleteSchemaMutation.status === 'pending'}
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
      {deleteSchemaMutation.status === 'pending' && <CircularProgress />}
      {deleteSchemaMutation.isError && (
        <Typography color="error">
          {deleteSchemaMutation.error?.message || 'Failed to delete schema'}
        </Typography>
      )}

      <Divider sx={{ marginBottom: 2 }} />

      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="h5" gutterBottom>
          Overview
        </Typography>
        <Grid container spacing={2}>
          <Grid size={6}>
            <Typography variant="body1">
              <strong>Name:</strong> {schema.name}
            </Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="body1">
              <strong>Owner:</strong> {schema.owner || 'N/A'}
            </Typography>
          </Grid>
          <Grid size={12}>
            <Typography variant="body1">
              <strong>Comment:</strong> {schema.comment}
            </Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="body1">
              <strong>ID:</strong> {schema.schema_id}
            </Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="body1">
              <strong>Catalog Name:</strong> {schema.catalog_name}
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
              {new Date(schema.created_at).toLocaleString()}
            </Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="body1">
              <strong>Updated At:</strong>{' '}
              {schema.updated_at
                ? new Date(schema.updated_at).toLocaleString()
                : 'N/A'}
            </Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="body1">
              <strong>Created By:</strong> {schema.created_by || 'N/A'}
            </Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="body1">
              <strong>Updated By:</strong> {schema.updated_by || 'N/A'}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Divider />

      <Box sx={{ marginTop: 2 }}>
        <Typography variant="h5" gutterBottom>
          Tables
        </Typography>
        <ListTables tables={tables} onTableClick={onTableClick} />
      </Box>

      <Modal open={showUpdateForm} onClose={() => setShowUpdateForm(false)}>
        <Box
          sx={{
            padding: 2,
            backgroundColor: 'white',
            margin: 'auto',
            marginTop: '10%',
            width: '50%'
          }}
        >
          <UpdateSchemaForm
            catalog={schema.catalog_name}
            schema={schema}
            onSuccess={() => setShowUpdateForm(false)}
            onBack={() => setShowUpdateForm(false)}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default SchemaDetails;
