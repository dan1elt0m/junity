import React from 'react';
import {
  Modal,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton
} from '@mui/material';
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
  const rows = data.slice(1, 11); // Get the first 10 rows

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
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
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ marginBottom: 2 }}
        >
          Displaying the top 10 rows
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {headers.map(key => (
                  <TableCell
                    key={key}
                    sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}
                  >
                    {key}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  {Object.values(row).map((value, idx) => (
                    <TableCell key={idx}>{value}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Modal>
  );
};
