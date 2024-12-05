import React, { useContext, useState } from 'react';
import {
  Box,
  Typography,
  Grid2 as Grid,
  Divider,
  Button,
  Alert
} from '@mui/material';
import ListColumns from './ListColumns';
import { TableInterface } from '../../types/interfaces';
import { useDeleteTable, useListTables } from '../../hooks/table';
import { PreviewTableModal } from '../modals/PreviewTable';
import { ClientContext } from '../../context/client';
import Cookies from 'js-cookie';
import axios from 'axios';

interface TableDetailsProps {
  table: TableInterface;
}

const TableDetails: React.FC<TableDetailsProps> = ({ table }) => {
  const apiContext = useContext(ClientContext);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const deleteTableMutation = useDeleteTable({
    catalog: table.catalog_name,
    schema: table.schema_name
  });
  const listTablesRequest = useListTables({
    catalog: table.catalog_name,
    schema: table.schema_name
  });

  const handleDeleteTable = () => {
    if (confirm(`Are you sure you want to delete table ${table.name}?`)) {
      deleteTableMutation.mutate(
        {
          catalog_name: table.catalog_name,
          schema_name: table.schema_name,
          name: table.name
        },
        {
          onSuccess: () => {
            listTablesRequest.refetch(table.catalog_name, table.schema_name);
          }
        }
      );
    }
  };

  const handlePreview = async () => {
    try {
      console.log('Requesting table preview data');
      const tableName = `${table.catalog_name}.${table.schema_name}.${table.name}`;
      const accessToken = Cookies.get('access_token') || '';
      const response = await axios.get(`/junity-server/preview`, {
        params: {
          table_name: tableName,
          access_token: accessToken,
          api_endpoint: apiContext.defaults.baseURL
        }
      });
      const data = await JSON.parse(response.data.data);
      console.log('Preview data:', data);
      setPreviewData(data);
      setIsPreviewOpen(true);
      setErrorMessage(null); // Clear any previous error message
    } catch (error) {
      console.error('Error fetching preview data:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error message:', error.message);
        setErrorMessage(
          `Error fetching preview data: ${error.message}. View console for more details.`
        );
      } else {
        setErrorMessage(
          'An unexpected error occurred. View console for more details.'
        );
      }
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2,
          marginBottom: 2
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ flexGrow: 1 }}>
          <span className="jp-icon-table"></span>
          {table.name}
        </Typography>
        <Button variant="contained" color="primary" onClick={handlePreview}>
          Preview
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleDeleteTable}
          disabled={deleteTableMutation.status === 'pending'}
        >
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
            <Typography variant="body1">
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
      <PreviewTableModal
        open={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        data={previewData}
      />
    </Box>
  );
};

export default TableDetails;
