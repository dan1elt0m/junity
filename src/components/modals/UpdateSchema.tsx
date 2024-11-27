import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useUpdateSchema } from '../../hooks/schema';
import { SchemaInterface } from '../../types/interfaces';

interface UpdateSchemaFormProps {
  catalog: string;
  schema: SchemaInterface;
  onSuccess: () => void;
  onBack: () => void;
}

const UpdateSchemaForm: React.FC<UpdateSchemaFormProps> = ({
  catalog,
  schema,
  onSuccess,
  onBack
}) => {
  const updateSchemaMutation = useUpdateSchema({
    catalog,
    schema: schema.name
  });
  const [schemaComment, setSchemaComment] = useState(schema.comment || '');
  const [error, setError] = useState<string | null>(null);

  const handleUpdateSchema = (event: React.FormEvent) => {
    event.preventDefault();
    updateSchemaMutation.mutate(
      { comment: schemaComment },
      {
        onSuccess: () => {
          setError(null);
          onSuccess();
        },
        onError: (err: any) => {
          setError(
            err.message || 'An error occurred while updating the schema.'
          );
        }
      }
    );
  };

  return (
    <Box component="form" onSubmit={handleUpdateSchema}>
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
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Update
        </Button>
      </Box>
    </Box>
  );
};

export default UpdateSchemaForm;
