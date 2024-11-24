import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import { CatalogInterface } from '../../types/interfaces';

interface ListCatalogsProps {
  catalogs: CatalogInterface[];
  onCatalogClick: (catalog: CatalogInterface) => void;
}

const ListCatalogs: React.FC<ListCatalogsProps> = ({
  catalogs,
  onCatalogClick
}) => {
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
        {catalogs.map(catalog => (
          <TableRow
            key={catalog.id}
            style={{ cursor: 'pointer', backgroundColor: '#f5f5f5' }}
            onMouseEnter={e =>
              (e.currentTarget.style.backgroundColor = '#e0e0e0')
            }
            onMouseLeave={e =>
              (e.currentTarget.style.backgroundColor = '#f5f5f5')
            }
            onClick={() => onCatalogClick(catalog)}
          >
            <TableCell>{catalog.name}</TableCell>
            <TableCell>{catalog.owner || 'N/A'}</TableCell>
            <TableCell>
              {new Date(catalog.created_at).toLocaleString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ListCatalogs;
