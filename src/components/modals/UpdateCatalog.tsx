import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useUpdateCatalog } from '../../hooks/catalog';
import { CatalogInterface } from '../../types/interfaces';

interface UpdateCatalogFormProps {
  catalog: CatalogInterface;
  onSuccess: () => void;
  onBack: () => void;
}

const UpdateCatalogForm: React.FC<UpdateCatalogFormProps> = ({ catalog, onSuccess, onBack }) => {
  const updateCatalogMutation = useUpdateCatalog(catalog.name);
  const [catalogComment, setCatalogComment] = useState(catalog.comment || '');
  const [error, setError] = useState<string | null>(null);

  const handleUpdateCatalog = (event: React.FormEvent) => {
    event.preventDefault();
    updateCatalogMutation.mutate(
      { comment: catalogComment },
      {
        onSuccess: () => {
          setError(null);
          onSuccess();
        },
        onError: (err: any) => {
          setError(err.message || 'An error occurred while updating the catalog.');
        },
      }
    );
  };

  return (
    <Box component="form" onSubmit={handleUpdateCatalog}>
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
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Update
        </Button>
      </Box>
    </Box>
  );
};

export default UpdateCatalogForm;