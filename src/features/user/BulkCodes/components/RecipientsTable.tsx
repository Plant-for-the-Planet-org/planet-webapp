import React, { ReactElement } from 'react';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import { SetState } from '../../../common/types/common';
import { Recipient, TableHeader } from '../BulkCodesTypes';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '../../../../../public/assets/images/icons/InfoIcon';
import NewRow from './NewRow';
import styles from '../BulkCodes.module.scss';

interface RecipientsTableProps {
  headers: TableHeader[];
  recipients: Recipient[];
  setRecipients: SetState<Recipient[]>;
}

const RecipientsTable = ({
  headers,
  recipients,
  setRecipients,
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
              {/* Empty header above the action column */}
              <TableCell></TableCell>
              {headers.map((header) => {
                const { key, displayText, helpText } = header;
                return (
                  <TableCell key={key}>
                    <h3 className={styles.tableHeaderContent}>
                      {displayText}
                      {helpText !== undefined && helpText.length > 0 && (
                        <>
                          {' '}
                          <Tooltip title={helpText} arrow>
                            <span className={styles.headerInfoIcon}>
                              <InfoIcon />
                            </span>
                          </Tooltip>
                        </>
                      )}
                    </h3>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            <NewRow setRecipients={setRecipients} />
            {recipients
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((recipient, index) => {
                return (
                  <TableRow hover tabIndex={-1} key={index}>
                    {/* Empty cell - to add edit/delete actions here */}
                    <TableCell></TableCell>
                    {headers.map((header) => {
                      const value = recipient[header.key];
                      return <TableCell key={header.key}>{value}</TableCell>;
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
