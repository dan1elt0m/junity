import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import { TableInterface } from '../../types/interfaces';

interface ListTablesProps {
  tables: TableInterface[];
  onTableClick: (table: TableInterface) => void;
}

const ListTables: React.FC<ListTablesProps> = ({ tables, onTableClick }) => {
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
        {tables.map(table => (
          <TableRow
            key={table.table_id}
            onClick={() => onTableClick(table)}
            style={{ cursor: 'pointer', backgroundColor: '#f5f5f5' }}
            onMouseEnter={e =>
              (e.currentTarget.style.backgroundColor = '#e0e0e0')
            }
            onMouseLeave={e =>
              (e.currentTarget.style.backgroundColor = '#f5f5f5')
            }
          >
            <TableCell>{table.name}</TableCell>
            <TableCell>{table.owner || 'N/A'}</TableCell>
            <TableCell>{new Date(table.created_at).toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ListTables;
