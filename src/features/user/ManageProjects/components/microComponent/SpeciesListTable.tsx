import type { APIError } from '@planet-sdk/common';
import type {
  QuestionnaireFieldColumn,
  QuestionnaireSpeciesRow,
} from '../../../../common/types/project';
import type { SpeciesSuggestionType } from '../../../TreeMapper/Treemapper';

import { useEffect, useMemo, useState } from 'react';
import {
  Autocomplete,
  Button,
  IconButton,
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

function blankRow(columns: QuestionnaireFieldColumn[]): QuestionnaireSpeciesRow {
  const row: QuestionnaireSpeciesRow = {};
  for (const column of columns) row[column.key] = '';
  return row;
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

  // Always render at least `minRows` rows so the table reads as a form to fill
  // in rather than an empty box, without persisting those blanks.
  const rows = useMemo(() => {
    const filled = value?.length ? value : [];
    const padding = Math.max(0, minRows - filled.length);
    return [
      ...filled,
      ...Array.from({ length: padding }, () => blankRow(columns)),
    ];
  }, [value, minRows, columns]);

  const updateCell = (
    rowIndex: number,
    key: string,
    cell: string | number
  ): void => {
    const next = rows.map((row, i) =>
      i === rowIndex ? { ...row, [key]: cell } : row
    );
    onChange(next);
  };

  const removeRow = (rowIndex: number): void => {
    onChange(rows.filter((_row, i) => i !== rowIndex));
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
                    size="small"
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
          onClick={() => onChange([...rows, blankRow(columns)])}
          sx={{ mt: 1 }}
        >
          {t('addSpeciesRow')}
        </Button>
      )}
    </>
  );
}
