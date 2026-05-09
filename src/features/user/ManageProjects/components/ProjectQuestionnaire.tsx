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
  FormLabel,
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

type QuestionnaireFormData = Record<string, string | number | string[]>;

function humanizeLabel(value: string): string {
  return value.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
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
    } else {
      defaults[name] = typeof val === 'string' ? val : '';
    }
  }
  return defaults;
}

export default function ProjectQuestionnaire({
  handleBack,
  handleNext,
  projectGUID,
  projectDetails,
  setProjectDetails,
  isLocked,
  onCompletenessChange,
}: QuestionnaireProps): ReactElement {
  const t = useTranslations('ManageProjects');
  const { getApiAuthenticated, putApiAuthenticated } = useApi();
  const setErrors = useErrorHandlingStore((state) => state.setErrors);

  const [schema, setSchema] = useState<QuestionnaireSchema | null>(null);
  const [isLoadingSchema, setIsLoadingSchema] = useState(true);
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

  const { control, handleSubmit, reset, trigger, getValues } =
    useForm<QuestionnaireFormData>({
      mode: 'onBlur',
      defaultValues: {},
    });

  const watchedValues = useWatch({ control });

  const purpose = projectDetails?.purpose ?? 'trees';

  useEffect(() => {
    const fetchSchema = async () => {
      try {
        const result = await getApiAuthenticated<QuestionnaireSchema>(
          `/app/projects/questionnaire-schema/${purpose}`,
          { additionalHeaders: { Accept: 'application/json' } }
        );
        setSchema(result);
      } catch (err) {
        setErrors(parseApiError(err as APIError));
      } finally {
        setIsLoadingSchema(false);
      }
    };
    fetchSchema();
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
    const allFilled = visibleFields.every(([name, field]) => {
      const val = watchedValues[name];
      if (field.type === 'multi_choice') return Array.isArray(val) && val.length > 0;
      return val !== undefined && val !== '' && val !== null;
    });
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

  function renderField(
    name: string,
    field: QuestionnaireFieldSchema
  ): ReactElement {
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
        </div>
      );
    }

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
        </div>
      );
    }

    // text / string / default
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
      </div>
    );
  }

  return (
    <CenteredContainer>
      <StyledForm>
        {projectDetails && (
          <ProjectLockedBanner
            verificationStatus={projectDetails.verificationStatus}
          />
        )}
        {!isLoadingSchema && !isLocked && visibleFields.length > 0 &&
          (projectDetails as ExtendedProfileProjectPropertiesTrees | null)
            ?.questionnaire != null &&
          !visibleFields.every(([name, field]) => {
            const val = watchedValues[name];
            return field.type === 'multi_choice'
              ? Array.isArray(val) && val.length > 0
              : val !== undefined && val !== '' && val !== null;
          }) && (
            <Alert severity="info" sx={{ mb: 2 }}>
              {t('incompleteFieldsBanner')}
            </Alert>
          )}

        <div className="inputContainer">
          {isLoadingSchema ? (
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
