import React from 'react';
import { Modal, Box, Typography, Paper, IconButton } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import CloseIcon from '@mui/icons-material/Close';

interface PreviewModalProps {
  open: boolean;
  onClose: () => void;
  data: Record<string, React.ReactNode>[];
}

export const PreviewTableModal: React.FC<PreviewModalProps> = ({
  open,
  onClose,
  data
}) => {
  if (data.length === 0) {
    return null;
  }

  const headers = Object.keys(data[0]);
  const rows = data.map((row, index) => ({ id: index, ...row }));

  const columns: GridColDef[] = headers.map(header => ({
    field: header,
    headerName: header
  }));

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Table Preview
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Paper sx={{ height: '100%', width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[5, 10, 20, 50, 100]}
            rowHeight={25}
            sx={{
              border: 1,
              borderColor: 'grey.500',
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid grey'
              },
              '& .MuiDataGrid-columnHeaders': {
                borderBottom: '1px solid grey'
              }
            }}
          />
        </Paper>
      </Box>
    </Modal>
  );
};
