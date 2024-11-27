import React from 'react';
import { Box, Typography, Grid2 as Grid, Divider, Button } from '@mui/material';
import ListColumns from './ListColumns';
import { TableInterface } from '../../types/interfaces';
import { useDeleteTable, useListTables } from '../../hooks/table';

interface TableDetailsProps {
  table: TableInterface;
}

const TableDetails: React.FC<TableDetailsProps> = ({ table }) => {
  const deleteTableMutation = useDeleteTable({
    catalog: table.catalog_name,
    schema: table.schema_name,
  });
  const listTablesRequest = useListTables({
    catalog: table.catalog_name,
    schema: table.schema_name});

  const handleDeleteTable = () => {
    if (confirm(`Are you sure you want to delete table ${table.name}?`)) {
      deleteTableMutation.mutate({
        catalog_name: table.catalog_name,
        schema_name: table.schema_name,
        name: table.name
      },
        {
          onSuccess: () => {
            listTablesRequest.refetch();
          }
        },);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, marginBottom: 2 }}>
        <Typography variant="h4"  gutterBottom sx={{ flexGrow: 1 }}>
          <span className="jp-icon-table"></span>
          {table.name}
        </Typography>
        <Button variant="contained" color="error" onClick={handleDeleteTable} disabled={deleteTableMutation.status === 'pending'}>
          Delete
        </Button>
      </Box>
      <Divider sx={{ marginBottom: 2 }} />

      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="h5" gutterBottom>
          Overview
        </Typography>
        <Grid container spacing={2}>
          <Grid size={6}>
            <Typography variant="body1" >
              <strong>Name:</strong> {table.name}
            </Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="body1">
              <strong>Owner:</strong> {table.owner || 'N/A'}
            </Typography>
          </Grid>
          <Grid size={12}>
            <Typography variant="body1">
              <strong>Comment:</strong> {table.comment}
            </Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="body1">
              <strong>ID:</strong> {table.table_id}
            </Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="body1">
              <strong>Catalog Name:</strong> {table.catalog_name}
            </Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="body1">
              <strong>Schema Name:</strong> {table.schema_name}
            </Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="body1">
              <strong>Table Type:</strong> {table.table_type}
            </Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="body1">
              <strong>Data Source Format:</strong> {table.data_source_format}
            </Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="body1">
              <strong>Storage Location:</strong> {table.storage_location}
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
              {new Date(table.created_at).toLocaleString()}
            </Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="body1">
              <strong>Updated At:</strong>{' '}
              {table.updated_at
                ? new Date(table.updated_at).toLocaleString()
                : 'N/A'}
            </Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="body1">
              <strong>Created By:</strong> {table.created_by || 'N/A'}
            </Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="body1">
              <strong>Updated By:</strong> {table.updated_by || 'N/A'}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Divider />

      <Box sx={{ marginTop: 2 }}>
        <Typography variant="h5" gutterBottom>
          Columns
        </Typography>
        <ListColumns columns={table.columns} />
      </Box>
    </Box>
  );
};

export default TableDetails;;
