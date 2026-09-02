import type { ReactElement } from 'react';
import type { APIError } from '@planet-sdk/common';
import type {
  DueDiligenceFields,
  DueDiligenceFieldName,
  DueDiligenceFieldsResponse,
} from '../../../common/types/dueDiligence';

import { useEffect, useState } from 'react';
import { Button, TextField } from '@mui/material';
import { handleError } from '@planet-sdk/common';
import { useTranslations } from 'next-intl';
import styles from '../DueDiligence.module.scss';
import { useApi } from '../../../../hooks/useApi';
import { useErrorHandlingStore } from '../../../../stores';

/** Empty strings rather than nulls, so every input stays controlled. */
function toFormValues(fields: DueDiligenceFields): Record<string, string> {
  return Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [key, value ?? ''])
  );
}

interface Props {
  fields: DueDiligenceFields;
  onSaved: (response: DueDiligenceFieldsResponse) => void;
}

export default function OrganizationDataForm({
  fields,
  onSaved,
}: Props): ReactElement {
  const t = useTranslations('Me.dueDiligence');
  const { putApiAuthenticated } = useApi();
  const setErrors = useErrorHandlingStore((state) => state.setErrors);

  const [values, setValues] = useState(() => toFormValues(fields));
  const [isSaving, setIsSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  useEffect(() => {
    setValues(toFormValues(fields));
  }, [fields]);

  const setField = (name: DueDiligenceFieldName, value: string) => {
    setValues((previous) => ({ ...previous, [name]: value }));
    setHasSaved(false);
  };

  const save = async () => {
    setIsSaving(true);
    try {
      const response = await putApiAuthenticated<
        DueDiligenceFieldsResponse,
        Record<string, string>
      >('/app/profile/dueDiligence/fields', { payload: values });
      onSaved(response);
      setHasSaved(true);
    } catch (err) {
      setErrors(handleError(err as APIError));
    } finally {
      setIsSaving(false);
    }
  };

  const field = (name: DueDiligenceFieldName) => ({
    value: values[name] ?? '',
    onChange: (event: { target: { value: string } }) =>
      setField(name, event.target.value),
  });

  return (
    <div className={styles.section}>
      <span className={styles.sectionTitle}>{t('organizationData')}</span>
      <span className={styles.sectionHint}>{t('organizationDataHint')}</span>

      <div className="inputContainer">
        <TextField
          label={t('registrationNumber')}
          helperText={t('registrationNumberHelp')}
          {...field('registrationNumber')}
        />
        <TextField
          label={t('tin')}
          helperText={t('tinHelp')}
          {...field('tin')}
        />

        <div className={styles.nameRow}>
          <TextField
            label={t('contactFirstName')}
            fullWidth
            {...field('contactFirstName')}
          />
          <TextField
            label={t('contactLastName')}
            fullWidth
            {...field('contactLastName')}
          />
        </div>
        <span className={styles.sectionHint}>{t('contactHelp')}</span>

        <TextField
          label={t('contactEmail')}
          type="email"
          {...field('contactEmail')}
        />
        <TextField
          label={t('authorizedRepresentatives')}
          helperText={t('authorizedRepresentativesHelp')}
          multiline
          minRows={3}
          {...field('authorizedRepresentatives')}
        />
      </div>

      <div className={styles.actions}>
        <Button variant="contained" onClick={save} disabled={isSaving}>
          {isSaving ? <div className="spinner" /> : t('save')}
        </Button>
        {hasSaved && <span className={styles.savedNote}>{t('saved')}</span>}
      </div>
    </div>
  );
}
