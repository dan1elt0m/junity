import React, { useEffect, useState } from 'react';
import { useListTables } from '../../hooks/table';
import { Box, Typography, Grid2 as Grid, Divider } from '@mui/material';
import ListTables from './ListTables';
import { SchemaInterface, TableInterface } from '../../types/interfaces';

interface SchemaDetailsProps {
  schema: SchemaInterface;
  onTableClick: (table: TableInterface) => void;
}

const SchemaDetails: React.FC<SchemaDetailsProps> = ({
  schema,
  onTableClick
}) => {
  const [tables, setTables] = useState<TableInterface[]>([]);
  const listTablesRequest = useListTables({
    catalog: schema.catalog_name,
    schema: schema.name
  });

  useEffect(() => {
    if (listTablesRequest.data?.tables) {
      setTables(listTablesRequest.data.tables);
    }
  }, [listTablesRequest.data?.tables, schema.catalog_name]);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        <span className="jp-icon-schema-explorer"></span>
        {schema.name}
      </Typography>
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
    </Box>
  );
};

export default SchemaDetails;
