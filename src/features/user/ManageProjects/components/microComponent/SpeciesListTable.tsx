import type { APIError } from '@planet-sdk/common';
import type {
  QuestionnaireFieldColumn,
  QuestionnaireSpeciesRow,
  SpeciesSuggestionType,
} from '../../../../common/types/project';

import { useEffect, useMemo, useState } from 'react';

import {
  Autocomplete,
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { handleError } from '@planet-sdk/common';
import styles from '../../StepForm.module.scss';
import TrashIcon from '../../../../../../public/assets/images/icons/manageProjects/Trash';
import { useApi } from '../../../../../hooks/useApi';
import { useErrorHandlingStore } from '../../../../../stores/errorHandlingStore';

type SpeciesApiPayload = { q: string; t: string };

interface Props {
  columns: QuestionnaireFieldColumn[];
  /** Blank rows to show when there is no saved answer yet. */
  minRows: number;
  value: QuestionnaireSpeciesRow[];
  onChange: (rows: QuestionnaireSpeciesRow[]) => void;
  disabled?: boolean;
}

function blankRow(
  columns: QuestionnaireFieldColumn[]
): QuestionnaireSpeciesRow {
  const row: QuestionnaireSpeciesRow = {};
  for (const column of columns) row[column.key] = '';
  return row;
}

/** True when every cell in the row is empty, i.e. the row carries no answer. */
function isBlankRow(row: QuestionnaireSpeciesRow): boolean {
  return Object.values(row).every(
    (cell) => cell === '' || cell === null || cell === undefined
  );
}

/** Answers followed by enough blank rows to reach `minRows`. */
function padRows(
  answers: QuestionnaireSpeciesRow[],
  minRows: number,
  columns: QuestionnaireFieldColumn[]
): QuestionnaireSpeciesRow[] {
  const padding = Math.max(0, minRows - answers.length);
  return [
    ...answers,
    ...Array.from({ length: padding }, () => blankRow(columns)),
  ];
}

/**
 * Scientific-name typeahead for a single cell.
 *
 * Suggestions come from the same `/suggest.php` source the TreeMapper species
 * form uses. The stored value is the plain scientific name, not a species id,
 * because questionnaire answers are a flat JSON blob with no relations.
 */
function ScientificNameCell({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (next: string) => void;
  disabled?: boolean;
}) {
  const { postApi } = useApi();
  const [suggestions, setSuggestions] = useState<SpeciesSuggestionType[]>([]);
  const [query, setQuery] = useState('');
  const setErrors = useErrorHandlingStore((state) => state.setErrors);

  useEffect(() => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    // Debounced so typing a name does not fire a request per keystroke.
    const timer = setTimeout(async () => {
      try {
        const res = await postApi<SpeciesSuggestionType[], SpeciesApiPayload>(
          `/suggest.php`,
          { payload: { q: query, t: 'species' } }
        );
        setSuggestions(Array.isArray(res) ? res : []);
      } catch (err) {
        setErrors(handleError(err as APIError));
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [query]);

  const options = useMemo(
    () =>
      [...suggestions]
        .map((s) => s.scientificName)
        .filter((name): name is string => Boolean(name))
        .sort((a, b) => a.localeCompare(b)),
    [suggestions]
  );

  return (
    <Autocomplete
      freeSolo
      disabled={disabled}
      options={options}
      value={value ?? ''}
      onInputChange={(_event, next) => {
        setQuery(next);
        onChange(next);
      }}
      onChange={(_event, next) => onChange(next ?? '')}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          size="small"
          inputProps={{ ...params.inputProps, autoComplete: 'off' }}
        />
      )}
    />
  );
}

/**
 * Repeatable table for a `species_list` questionnaire field. Column types come
 * from the schema, so adding a column server-side needs no change here.
 */
export default function SpeciesListTable({
  columns,
  minRows,
  value,
  onChange,
  disabled,
}: Props) {
  const t = useTranslations('ManageProjects');

  // Blank padding rows make the table read as a form to fill in. They stay local, so only the non-blank rows reach form state.
  const [rows, setRows] = useState<QuestionnaireSpeciesRow[]>(() =>
    padRows(value ?? [], minRows, columns)
  );

  // Adopt `value` only when it differs from what the grid already shows, so typing does not rebuild the grid from its own `onChange`.
  useEffect(() => {
    const shown = rows.filter((row) => !isBlankRow(row));
    const incoming = value ?? [];
    if (JSON.stringify(shown) === JSON.stringify(incoming)) return;
    setRows(padRows(incoming, minRows, columns));
  }, [value]);

  const commit = (next: QuestionnaireSpeciesRow[]): void => {
    setRows(next);
    onChange(next.filter((row) => !isBlankRow(row)));
  };

  const updateCell = (
    rowIndex: number,
    key: string,
    cell: string | number
  ): void => {
    commit(
      rows.map((row, i) => (i === rowIndex ? { ...row, [key]: cell } : row))
    );
  };

  const removeRow = (rowIndex: number): void => {
    commit(rows.filter((_row, i) => i !== rowIndex));
  };

  return (
    <>
      <Table size="small">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.key}>{column.label}</TableCell>
            ))}
            <TableCell padding="none" />
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column) => {
                const cell = row[column.key] ?? '';
                // The cell is not a react-hook-form field, so the column's 0 to 100 bound has nothing to enforce it. Checked here so a wrong value is visible rather than silent until the backend rejects the save.
                const outOfRange =
                  column.type === 'percentage' &&
                  cell !== '' &&
                  (Number(cell) < 0 || Number(cell) > 100);
                return (
                  <TableCell key={column.key}>
                    {column.type === 'species' ? (
                      <ScientificNameCell
                        value={String(cell)}
                        onChange={(next) =>
                          updateCell(rowIndex, column.key, next)
                        }
                        disabled={disabled}
                      />
                    ) : column.type === 'choice' ? (
                      <TextField
                        select
                        fullWidth
                        size="small"
                        value={String(cell)}
                        disabled={disabled}
                        onChange={(event) =>
                          updateCell(rowIndex, column.key, event.target.value)
                        }
                      >
                        {(column.choices ?? []).map((choice) => (
                          <MenuItem key={choice} value={choice}>
                            {choice}
                          </MenuItem>
                        ))}
                      </TextField>
                    ) : (
                      <TextField
                        type="number"
                        fullWidth
                        size="small"
                        value={String(cell)}
                        disabled={disabled}
                        onChange={(event) =>
                          updateCell(rowIndex, column.key, event.target.value)
                        }
                        error={outOfRange}
                        helperText={
                          outOfRange ? t('percentageRangeShort') : undefined
                        }
                        inputProps={
                          column.type === 'percentage'
                            ? { min: 0, max: 100, step: 'any' }
                            : undefined
                        }
                        InputProps={
                          column.type === 'percentage'
                            ? {
                                endAdornment: (
                                  <InputAdornment position="end">
                                    %
                                  </InputAdornment>
                                ),
                              }
                            : undefined
                        }
                      />
                    )}
                  </TableCell>
                );
              })}
              <TableCell padding="none">
                {!disabled && rows.length > 1 && (
                  <IconButton
                    aria-label={t('deleteSpeciesRow')}
                    onClick={() => removeRow(rowIndex)}
                    className={styles.deleteRowButton}
                  >
                    <TrashIcon />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {!disabled && (
        <Button
          size="small"
          onClick={() => setRows([...rows, blankRow(columns)])}
          sx={{ mt: 1 }}
        >
          {t('addSpeciesRow')}
        </Button>
      )}
    </>
  );
}
