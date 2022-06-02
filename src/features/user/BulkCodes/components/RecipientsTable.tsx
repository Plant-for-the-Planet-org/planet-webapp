import React, { ReactElement } from 'react';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

interface RecipientsTableProps {
  headers: string[];
  recipients: Object[];
}

/* interface Column {
  id:
    | 'recipient_name'
    | 'recipient_email'
    | 'recipient_notify'
    | 'units'
    | 'recipient_message'
    | 'recipient_occasion';
  label: string;
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'recipient_name', label: 'Name' },
  { id: 'recipient_email', label: 'Email' },
  { id: 'recipient_notify', label: 'Notify' },
  {
    id: 'units',
    label: 'Units',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  { id: 'recipient_message', label: 'Message' },
  { id: 'recipient_occasion', label: 'Occasion' },
];

interface Data {
  recipient_name: string;
  recipient_email: string;
  recipient_notify: boolean;
  units: number;
  recipient_message: string;
  recipient_occasion: string;
}

function createData(
  name: string,
  code: string,
  population: number,
  size: number
): Data {
  const density = population / size;
  return { name, code, population, size, density };
} */

/* const rows = [
  createData('India', 'IN', 1324171354, 3287263),
  createData('China', 'CN', 1403500365, 9596961),
  createData('Italy', 'IT', 60483973, 301340),
  createData('United States', 'US', 327167434, 9833520),
  createData('Canada', 'CA', 37602103, 9984670),
  createData('Australia', 'AU', 25475400, 7692024),
  createData('Germany', 'DE', 83019200, 357578),
  createData('Ireland', 'IE', 4857000, 70273),
  createData('Mexico', 'MX', 126577691, 1972550),
  createData('Japan', 'JP', 126317000, 377973),
  createData('France', 'FR', 67022000, 640679),
  createData('United Kingdom', 'GB', 67545757, 242495),
  createData('Russia', 'RU', 146793744, 17098246),
  createData('Nigeria', 'NG', 200962417, 923768),
  createData('Brazil', 'BR', 210147125, 8515767),
]; */

const RecipientsTable = ({
  headers,
  recipients,
}: RecipientsTableProps): ReactElement => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table" size="small">
          <TableHead>
            <TableRow>
              {headers.map((header) => (
                <TableCell
                  key={header}
                  /* align={column.align} */
                  style={
                    {
                      /* minWidth: column.minWidth */
                    }
                  }
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {recipients
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((recipient, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    {headers.map((header) => {
                      const value = recipient[header];
                      return (
                        <TableCell key={header} /* align={column.align} */>
                          {/* {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value} */}
                          {value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={recipients.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default RecipientsTable;
