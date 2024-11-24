import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import { SchemaInterface } from '../../types/interfaces';

interface ListSchemaProps {
  schemas: SchemaInterface[];
  onSchemaClick: (schema: SchemaInterface) => void;
}

const ListSchema: React.FC<ListSchemaProps> = ({ schemas, onSchemaClick }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Owner</TableCell>
          <TableCell>Created At</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {schemas.map(schema => (
          <TableRow
            key={schema.schema_id}
            onClick={() => onSchemaClick(schema)}
            style={{ cursor: 'pointer', backgroundColor: '#f5f5f5' }}
            onMouseEnter={e =>
              (e.currentTarget.style.backgroundColor = '#e0e0e0')
            }
            onMouseLeave={e =>
              (e.currentTarget.style.backgroundColor = '#f5f5f5')
            }
          >
            <TableCell>{schema.name}</TableCell>
            <TableCell>{schema.owner || 'N/A'}</TableCell>
            <TableCell>
              {new Date(schema.created_at).toLocaleString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ListSchema;
