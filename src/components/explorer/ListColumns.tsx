import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import { ColumnInterface } from '../../types/interfaces';

interface ListColumnsProps {
  columns: ColumnInterface[];
}

const ListColumns: React.FC<ListColumnsProps> = ({ columns }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Type</TableCell>
          <TableCell>Comment</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {columns.map(column => (
          <TableRow key={column.name}>
            <TableCell>{column.name}</TableCell>
            <TableCell>{column.type_name}</TableCell>
            <TableCell>{column.type_text}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ListColumns;
