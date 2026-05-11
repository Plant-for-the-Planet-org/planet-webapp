import type { ReactElement } from 'react';
import type { APIError } from '@planet-sdk/common';
import type {
  QuestionnaireProps,
  QuestionnaireSchema,
  QuestionnaireFieldSchema,
  ExtendedProfileProjectProperties,
  ExtendedProfileProjectPropertiesTrees,
} from '../../../common/types/project';

import { useEffect, useMemo, useState } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import {
  Alert,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import BackArrow from '../../../../../public/assets/images/icons/headerIcons/BackArrow';
import styles from '../StepForm.module.scss';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import StyledForm from '../../../common/Layout/StyledForm';
import { ProjectCreationTabs } from '..';
import { useApi } from '../../../../hooks/useApi';
import { parseApiError } from '../../../../utils/parseApiError';
import { useErrorHandlingStore } from '../../../../stores/errorHandlingStore';
import ProjectLockedBanner from './microComponent/ProjectLockedBanner';
import AnnotationCallout from './microComponent/AnnotationCallout';
import {
  getCachedSchema,
  setCachedSchema,
} from '../utils/questionnaireSchemaCache';

// Widened to support nested row_list / matrix values
type QuestionnaireFormData = Record<string, unknown>;

function humanizeLabel(value: string): string {
  return value.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

/** Returns true when the given field value counts as "filled" (at least one cell non-empty). */
export function isFieldFilled(
  field: QuestionnaireFieldSchema,
  val: unknown
): boolean {
  if (field.type === 'multi_choice')
    return Array.isArray(val) && val.length > 0;

  if (field.type === 'row_list') {
    if (!val || typeof val !== 'object') return false;
    return Object.values(val as Record<string, unknown>).some(
      (v) => v !== '' && v !== null && v !== undefined
    );
  }

  if (field.type === 'matrix') {
    if (!val || typeof val !== 'object') return false;
    return Object.values(val as Record<string, unknown>).some(
      (r) =>
        typeof r === 'object' &&
        r !== null &&
        Object.values(r as Record<string, unknown>).some(
          (v) => v !== '' && v !== null && v !== undefined
        )
    );
  }

  return val !== undefined && val !== '' && val !== null;
}

function buildDefaults(
  visibleFields: [string, QuestionnaireFieldSchema][],
  existing: Record<string, unknown> | null | undefined
): QuestionnaireFormData {
  const defaults: QuestionnaireFormData = {};
  for (const [name, field] of visibleFields) {
    const val = existing?.[name];

    if (field.type === 'multi_choice') {
      defaults[name] = Array.isArray(val) ? (val as string[]) : [];
    } else if (field.type === 'number' || field.type === 'integer') {
      defaults[name] =
        typeof val === 'number' ? val : val != null ? Number(val) : '';
    } else if (field.type === 'row_list' && field.rows) {
      const existing_row = val as Record<string, unknown> | undefined;
      const rowDefaults: Record<string, string | number> = {};
      for (const row of field.rows) {
        const v = existing_row?.[row.key];
        rowDefaults[row.key] =
          typeof v === 'number' ? v : typeof v === 'string' ? v : '';
      }
      defaults[name] = rowDefaults;
    } else if (field.type === 'matrix' && field.rows && field.columns) {
      const existingMatrix = val as
        | Record<string, Record<string, unknown>>
        | undefined;
      const matrixDefaults: Record<string, Record<string, string | number>> =
        {};
      for (const row of field.rows) {
        matrixDefaults[row.key] = {};
        for (const col of field.columns) {
          const v = existingMatrix?.[row.key]?.[col.key];
          matrixDefaults[row.key][col.key] =
            typeof v === 'number' ? v : typeof v === 'string' ? v : '';
        }
      }
      defaults[name] = matrixDefaults;
    } else {
      defaults[name] = typeof val === 'string' ? val : '';
    }
  }
  return defaults;
}

/** Merge adjacent columns that share the same group label into colspan spans. */
function columnGroups(
  columns: { key: string; label: string; group?: string }[]
): { label: string; count: number }[] {
  const groups: { label: string; count: number }[] = [];
  for (const col of columns) {
    const g = col.group ?? '';
    const last = groups[groups.length - 1];
    if (last && last.label === g) {
      last.count++;
    } else {
      groups.push({ label: g, count: 1 });
    }
  }
  return groups;
}

const tableCellSx = {
  border: '1px solid',
  borderColor: 'divider',
  padding: '6px 10px',
};

export default function ProjectQuestionnaire({
  handleBack,
  handleNext,
  projectGUID,
  projectDetails,
  setProjectDetails,
  isLocked,
  onCompletenessChange,
  initialSchema = null,
  purpose,
}: QuestionnaireProps): ReactElement {
  const t = useTranslations('ManageProjects');
  const { getApiAuthenticated, putApiAuthenticated } = useApi();
  const setErrors = useErrorHandlingStore((state) => state.setErrors);

  // Lazy initializer: check initialSchema then module cache synchronously,
  // so the schema is available on the very first render if the parent pre-fetched it.
  const [schema, setSchema] = useState<QuestionnaireSchema | null>(
    () => initialSchema ?? getCachedSchema(purpose) ?? null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const classification =
    (projectDetails as ExtendedProfileProjectPropertiesTrees | null)
      ?.classification ?? '';

  const visibleFields = useMemo((): [string, QuestionnaireFieldSchema][] => {
    if (!schema) return [];
    return Object.entries(schema.fields).filter(
      ([, field]) =>
        field.classifications === null ||
        field.classifications.includes(classification)
    );
  }, [schema, classification]);

  const { control, reset, trigger, getValues } =
    useForm<QuestionnaireFormData>({
      mode: 'onBlur',
      defaultValues: {},
    });

  const watchedValues = useWatch({ control });

  // Sync if parent provides (or updates) the schema after mount
  useEffect(() => {
    if (initialSchema !== null) {
      setSchema(initialSchema);
    }
  }, [initialSchema]);

  // Fetch only when schema is still missing (no initialSchema, no cache hit)
  useEffect(() => {
    if (schema !== null) return;

    const fetchSchema = async () => {
      try {
        const result = await getApiAuthenticated<QuestionnaireSchema>(
          `/app/projects/questionnaire-schema/${purpose}`,
          { additionalHeaders: { Accept: 'application/json' } }
        );
        setCachedSchema(purpose, result);
        setSchema(result);
      } catch (err) {
        setErrors(parseApiError(err as APIError));
      }
    };
    void fetchSchema();
  }, [purpose]);

  useEffect(() => {
    if (visibleFields.length === 0) return;
    const existing =
      (projectDetails as ExtendedProfileProjectPropertiesTrees | null)
        ?.questionnaire ?? null;
    reset(buildDefaults(visibleFields, existing));
    if (existing) trigger();
  }, [schema, projectDetails]);

  useEffect(() => {
    if (visibleFields.length === 0) return;
    const allFilled = visibleFields.every(([name, field]) =>
      isFieldFilled(field, watchedValues[name])
    );
    onCompletenessChange(allFilled);
  }, [watchedValues, visibleFields.length]);

  const onSubmit = async (data: QuestionnaireFormData) => {
    setIsSubmitting(true);
    try {
      const result = await putApiAuthenticated<
        ExtendedProfileProjectProperties,
        Record<string, unknown>
      >(`/app/projects/${projectGUID}/questionnaire`, {
        payload: data as Record<string, unknown>,
      });
      setProjectDetails(result);
      handleNext(ProjectCreationTabs.REVIEW);
    } catch (err) {
      setErrors(parseApiError(err as APIError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const questionnaireAnnotations =
    projectDetails?.verificationStatus === 'revision_requested'
      ? (projectDetails.revisionRequest?.annotations ?? {})
      : {};

  function renderField(
    name: string,
    field: QuestionnaireFieldSchema
  ): ReactElement {
    const annotation = questionnaireAnnotations[`questionnaire.${name}`];

    // ── multi_choice ─────────────────────────────────────────────────────
    if (field.type === 'multi_choice' && field.choices) {
      return (
        <div key={name} className={styles.formFieldLarge}>
          <FormLabel component="legend" sx={{ mb: 1 }}>
            {field.label}
          </FormLabel>
          {field.description && <p>{field.description}</p>}
          <Controller
            name={name}
            control={control}
            rules={{ validate: (v) => (Array.isArray(v) ? v.length > 0 : !!v) }}
            render={({ field: { value, onChange } }) => {
              const current = Array.isArray(value) ? (value as string[]) : [];
              return (
                <FormGroup>
                  {field.choices!.map((choice) => (
                    <FormControlLabel
                      key={choice}
                      label={humanizeLabel(choice)}
                      control={
                        <Checkbox
                          checked={current.includes(choice)}
                          onChange={(e) => {
                            onChange(
                              e.target.checked
                                ? [...current, choice]
                                : current.filter((v) => v !== choice)
                            );
                          }}
                        />
                      }
                    />
                  ))}
                </FormGroup>
              );
            }}
          />
          {annotation && <AnnotationCallout text={annotation} />}
        </div>
      );
    }

    // ── number / integer ──────────────────────────────────────────────────
    if (field.type === 'number' || field.type === 'integer') {
      return (
        <div key={name} className={styles.formFieldLarge}>
          <Controller
            name={name}
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label={field.label}
                helperText={field.description ?? undefined}
                type="number"
                fullWidth
                onChange={onChange}
                onBlur={onBlur}
                value={value}
              />
            )}
          />
          {annotation && <AnnotationCallout text={annotation} />}
        </div>
      );
    }

    // ── row_list ──────────────────────────────────────────────────────────
    if (field.type === 'row_list' && field.rows) {
      return (
        <div key={name} className={styles.formFieldLarge}>
          <FormLabel component="legend" sx={{ mb: 1 }}>
            {field.label}
          </FormLabel>
          <Table
            size="small"
            sx={{ '& td, & th': tableCellSx, tableLayout: 'auto' }}
          >
            <TableBody>
              {field.rows.map((row) => (
                <TableRow key={row.key}>
                  <TableCell sx={{ fontSize: '0.875rem' }}>
                    {row.label}
                  </TableCell>
                  <TableCell sx={{ width: 140 }}>
                    <Controller
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      name={`${name}.${row.key}` as any}
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextField
                          type="number"
                          size="small"
                          fullWidth
                          onChange={onChange}
                          onBlur={onBlur}
                          value={(value as string | number) ?? ''}
                          inputProps={{ min: 0 }}
                        />
                      )}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {field.description && (
            <FormHelperText>{field.description}</FormHelperText>
          )}
          {annotation && <AnnotationCallout text={annotation} />}
        </div>
      );
    }

    // ── matrix ────────────────────────────────────────────────────────────
    if (field.type === 'matrix' && field.rows && field.columns) {
      const groups = columnGroups(field.columns);
      const hasGroups = groups.some((g) => g.label !== '');

      return (
        <div
          key={name}
          className={styles.formFieldLarge}
          style={{ overflowX: 'auto' }}
        >
          <FormLabel component="legend" sx={{ mb: 1 }}>
            {field.label}
          </FormLabel>
          <Table
            size="small"
            sx={{ '& td, & th': tableCellSx, tableLayout: 'auto' }}
          >
            <TableHead>
              {hasGroups && (
                <TableRow>
                  <TableCell />
                  {groups.map((g, i) => (
                    <TableCell
                      key={i}
                      colSpan={g.count}
                      align="center"
                      sx={{ fontWeight: 600, fontSize: '0.8rem' }}
                    >
                      {g.label}
                    </TableCell>
                  ))}
                </TableRow>
              )}
              <TableRow>
                <TableCell />
                {field.columns.map((col) => (
                  <TableCell
                    key={col.key}
                    align="center"
                    sx={{ fontWeight: 500, fontSize: '0.8rem', minWidth: 90 }}
                  >
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {field.rows.map((row) => (
                <TableRow key={row.key}>
                  <TableCell
                    sx={{
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      fontSize: '0.875rem',
                    }}
                  >
                    {row.label}
                  </TableCell>
                  {field.columns!.map((col) => (
                    <TableCell key={col.key} align="center">
                      <Controller
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        name={`${name}.${row.key}.${col.key}` as any}
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextField
                            type="number"
                            size="small"
                            onChange={onChange}
                            onBlur={onBlur}
                            value={(value as string | number) ?? ''}
                            inputProps={{
                              min: 0,
                              style: { textAlign: 'center', width: 60 },
                            }}
                          />
                        )}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {field.description && (
            <FormHelperText>{field.description}</FormHelperText>
          )}
          {annotation && <AnnotationCallout text={annotation} />}
        </div>
      );
    }

    // ── text / string / default ───────────────────────────────────────────
    return (
      <div key={name} className={styles.formFieldLarge}>
        <Controller
          name={name}
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label={field.label}
              helperText={field.description ?? undefined}
              multiline
              minRows={3}
              fullWidth
              onChange={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        />
        {annotation && <AnnotationCallout text={annotation} />}
      </div>
    );
  }

  // Show spinner until BOTH schema and projectDetails are available.
  // Deriving directly from the data avoids any intermediate flag that could
  // be false before the data actually arrives.
  const isLoading = schema === null || projectDetails === null;

  const allFieldsFilled =
    visibleFields.length > 0 &&
    visibleFields.every(([name, field]) =>
      isFieldFilled(field, watchedValues[name])
    );

  return (
    <CenteredContainer>
      <StyledForm>
        {projectDetails && (
          <ProjectLockedBanner
            verificationStatus={projectDetails.verificationStatus}
          />
        )}
        {!isLoading &&
          !isLocked &&
          visibleFields.length > 0 &&
          (projectDetails as ExtendedProfileProjectPropertiesTrees | null)
            ?.questionnaire != null &&
          !allFieldsFilled && (
            <Alert severity="info" sx={{ mb: 2 }}>
              {t('incompleteFieldsBanner')}
            </Alert>
          )}

        <div className="inputContainer">
          {isLoading ? (
            <CircularProgress size={32} />
          ) : visibleFields.length === 0 ? (
            <p>{t('noQuestionnaire')}</p>
          ) : (
            <>
              <p>{t('questionnaireDescription')}</p>
              {visibleFields.map(([name, field]) => renderField(name, field))}
            </>
          )}
        </div>

        <div className={styles.buttonsForProjectCreationForm}>
          <Button
            variant="outlined"
            onClick={() => handleBack(ProjectCreationTabs.PROJECT_SPENDING)}
            className="formButton"
            startIcon={<BackArrow />}
          >
            <p>{t('backToProjectSpending')}</p>
          </Button>

          {!isLocked && (
            <>
              <Button
                variant="contained"
                onClick={() => {
                  trigger();
                  void onSubmit(getValues());
                }}
                className="formButton"
              >
                {isSubmitting ? (
                  <div className={styles.spinner} />
                ) : (
                  t('saveAndContinue')
                )}
              </Button>
              <Button
                variant="contained"
                onClick={() => handleNext(ProjectCreationTabs.REVIEW)}
                className="formButton"
              >
                {t('skip')}
              </Button>
            </>
          )}
        </div>
      </StyledForm>
    </CenteredContainer>
  );
}
