import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useCreateSchema } from '../../hooks/schema';

interface CreateSchemaFormProps {
  catalog: string;
  onSuccess: () => void;
  onBack: () => void;
}

const CreateSchemaForm: React.FC<CreateSchemaFormProps> = ({
  catalog,
  onSuccess,
  onBack
}) => {
  const createSchemaMutation = useCreateSchema();
  const [schemaName, setSchemaName] = useState('');
  const [schemaComment, setSchemaComment] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleCreateSchema = (event: React.FormEvent) => {
    event.preventDefault();
    if (schemaName) {
      createSchemaMutation.mutate(
        { name: schemaName, catalog_name: catalog, comment: schemaComment },
        {
          onSuccess: () => {
            setSchemaName('');
            setSchemaComment('');
            setError(null);
            onSuccess();
          },
          onError: err => {
            setError(
              err.message || 'An error occurred while creating the schema.'
            );
          }
        }
      );
    }
  };

  return (
    <Box component="form" onSubmit={handleCreateSchema}>
      <TextField
        label="Schema Name"
        value={schemaName}
        onChange={e => setSchemaName(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Schema Comment"
        value={schemaComment}
        onChange={e => setSchemaComment(e.target.value)}
        fullWidth
        margin="normal"
      />
      {error && (
        <Typography color="error" sx={{ marginTop: 2 }}>
          {error}
        </Typography>
      )}
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}
      >
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

export default CreateSchemaForm;
