import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useCreateCatalog } from '../../hooks/catalog';

interface CreateCatalogFormProps {
  onSuccess: () => void;
  onBack: () => void;
}

const CreateCatalogForm: React.FC<CreateCatalogFormProps> = ({ onSuccess, onBack }) => {
  const createCatalogMutation = useCreateCatalog();
  const [catalogName, setCatalogName] = useState('');
  const [catalogComment, setCatalogComment] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleCreateCatalog = (event: React.FormEvent) => {
    event.preventDefault();
    if (catalogName) {
      createCatalogMutation.mutate(
        { name: catalogName, comment: catalogComment },
        {
          onSuccess: () => {
            setCatalogName('');
            setCatalogComment('');
            setError(null);
            onSuccess();
          },
          onError: (err: any) => {
            setError(err.message || 'An error occurred while creating the catalog.');
          },
        }
      );
    }
  };

  return (
    <Box component="form" onSubmit={handleCreateCatalog}>
      <TextField
        label="Catalog Name"
        value={catalogName}
        onChange={(e) => setCatalogName(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Catalog Comment"
        value={catalogComment}
        onChange={(e) => setCatalogComment(e.target.value)}
        fullWidth
        margin="normal"
      />
      {error && (
        <Typography color="error" sx={{ marginTop: 2 }}>
          {error}
        </Typography>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
        <Button variant="contained" color="secondary" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Create
        </Button>
      </Box>
    </Box>
  );
};

export default CreateCatalogForm;