import type { ReactElement } from 'react';
import type { APIError } from '@planet-sdk/common';
import type {
  DueDiligenceChecklist,
  DueDiligenceSubmitResponse,
} from '../../../common/types/dueDiligence';

import { useState } from 'react';
import { Alert, Box, Button } from '@mui/material';
import { handleError } from '@planet-sdk/common';
import { useTranslations } from 'next-intl';
import styles from '../DueDiligence.module.scss';
import { useApi } from '../../../../hooks/useApi';
import { outstandingItems } from '../utils/status';
import { useErrorHandlingStore } from '../../../../stores';

interface Props {
  checklist: DueDiligenceChecklist;
  onSubmitted: (submittedAt: string | null) => void;
}

/**
 * Submitting is the only thing that reaches a reviewer, and it needs the whole filing: every required document and every organisation field.
 * An organisation that cannot obtain one of them is asked to write to us instead, because a reviewer has nothing to act on without it.
 */
export default function SubmitForReview({
  checklist,
  onSubmitted,
}: Props): ReactElement {
  const t = useTranslations('Me.dueDiligence');
  const { postApiAuthenticated } = useApi();
  const setErrors = useErrorHandlingStore((state) => state.setErrors);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAwaitingReview = checklist.charitability.submittedAt !== null;

  const outstanding = outstandingItems(checklist);

  const submit = async () => {
    setIsSubmitting(true);
    try {
      const response = await postApiAuthenticated<
        DueDiligenceSubmitResponse,
        Record<string, never>
      >('/app/profile/dueDiligence/submit', { payload: {} });
      onSubmitted(response.submittedAt);
    } catch (err) {
      setErrors(handleError(err as APIError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.section}>
      <span className={styles.sectionTitle}>{t('submitTitle')}</span>
      <span className={styles.sectionHint}>
        {isAwaitingReview
          ? t('submitWaiting')
          : outstanding.length > 0
          ? t('submitIncomplete')
          : t('submitReady')}
      </span>

      {!isAwaitingReview && outstanding.length > 0 && (
        <Alert severity="warning" sx={{ mt: 1, mb: 1 }}>
          {t('outstandingTitle')}
          <Box
            component="ul"
            sx={{
              m: 0,
              mt: 0.75,
              pl: 2.5,
              display: 'grid',
              gap: 0.25,
            }}
          >
            {outstanding.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </Box>
        </Alert>
      )}

      <div className={styles.actions}>
        <Button
          variant="contained"
          onClick={submit}
          disabled={isSubmitting || isAwaitingReview || outstanding.length > 0}
        >
          {isSubmitting ? <div className="spinner" /> : t('submit')}
        </Button>
      </div>
    </div>
  );
}
