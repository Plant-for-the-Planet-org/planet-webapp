import type { ReactElement, ChangeEvent } from 'react';
import type { SetState } from '../../../common/types/common';
import type { Recipient, TableHeader } from '../BulkCodesTypes';

import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import themeProperties from '../../../../theme/themeProperties';
import EditIcon from '../../../../../public/assets/images/icons/EditIcon';
import DeleteIcon from '../../../../../public/assets/images/icons/DeleteIcon';
import AddRecipient from './AddRecipient';
import UpdateRecipient from './UpdateRecipient';
import ActionContainer from './ActionContainer';
import RecipientHeader from './RecipientHeader';

interface RecipientsTableProps {
  headers: TableHeader[];
  localRecipients: Recipient[];
  setLocalRecipients: SetState<Recipient[]>;
  canAddRecipients?: boolean;
  setIsAddingRecipient: SetState<boolean>;
  setIsEditingRecipient: SetState<boolean>;
}

const RecipientsTable = ({
  headers,
  localRecipients,
  setLocalRecipients,
  canAddRecipients = true,
  setIsAddingRecipient,
  setIsEditingRecipient,
}: RecipientsTableProps): ReactElement => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isEditActive, setIsEditActive] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const enterEditMode = (index: number): void => {
    setIsEditActive(true);
    setEditIndex(index);
    setIsEditingRecipient(true);
  };

  const exitEditMode = (): void => {
    setIsEditActive(false);
    setEditIndex(null);
    setIsEditingRecipient(false);
  };

  const handleChangePage = (event: unknown, newPage: number): void => {
    setPage(newPage);
    exitEditMode();
  };

  const handleChangeRowsPerPage = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setRowsPerPage(+event.target.value);
    setPage(0);
    exitEditMode();
  };

  const updateRecipient = (updatedRecipient: Recipient): void => {
    if (editIndex !== null) {
      const absoluteEditIndex = page * rowsPerPage + editIndex;
      const _localRecipients = [...localRecipients];
      _localRecipients[absoluteEditIndex] = updatedRecipient;
      setLocalRecipients(_localRecipients);
      exitEditMode();
    }
  };

  const deleteRecipient = (deleteIndex: number): void => {
    const absoluteDeleteIndex = page * rowsPerPage + deleteIndex;
    const _localRecipients = localRecipients.filter(
      (_recipient, index) => index !== absoluteDeleteIndex
    );
    setLocalRecipients(_localRecipients);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table" size="small">
          <TableHead>
            <TableRow>
              {/* Empty header above the action column */}
              <TableCell></TableCell>
              {headers.map((header) => (
                <RecipientHeader header={header} key={header.key} />
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!isEditActive && canAddRecipients && (
              <AddRecipient
                setLocalRecipients={setLocalRecipients}
                setIsAddingRecipient={setIsAddingRecipient}
                afterSaveCallback={() => setPage(0)}
              />
            )}
            {localRecipients
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((recipient, index) => {
                return isEditActive && editIndex === index ? (
                  <UpdateRecipient
                    exitEditMode={exitEditMode}
                    recipient={recipient}
                    updateRecipient={updateRecipient}
                    key={index}
                  />
                ) : (
                  <TableRow tabIndex={-1} key={index}>
                    <TableCell align="center" sx={{ minWidth: '80px' }}>
                      <ActionContainer>
                        {!isEditActive && (
                          <IconButton
                            size="small"
                            aria-label="edit recipient"
                            title="Edit Recipient"
                            color="primary"
                            onClick={() => enterEditMode(index)}
                          >
                            <EditIcon color={themeProperties.primaryColor} />
                          </IconButton>
                        )}
                      </ActionContainer>
                      <ActionContainer>
                        {!isEditActive && (
                          <IconButton
                            size="small"
                            aria-label="delete recipient"
                            title="Delete Recipient"
                            color="primary"
                            onClick={() => deleteRecipient(index)}
                          >
                            <DeleteIcon color={themeProperties.primaryColor} />
                          </IconButton>
                        )}
                      </ActionContainer>
                    </TableCell>
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
        count={localRecipients.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default RecipientsTable;
