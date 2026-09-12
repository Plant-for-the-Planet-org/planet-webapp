import type { ReactElement } from 'react';
import type { APIError } from '@planet-sdk/common';
import type {
  DueDiligenceChecklist,
  DueDiligenceSubmitResponse,
} from '../../../common/types/dueDiligence';

import { useState } from 'react';
import { Button } from '@mui/material';
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
 * Submitting is the only thing that reaches a reviewer, and it stays available
 * on an incomplete checklist on purpose: an organisation that cannot obtain one
 * of the documents has to be able to say so rather than be locked out.
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
          ? t('submitIncomplete', { outstanding: outstanding.join(', ') })
          : t('submitReady')}
      </span>

      <div className={styles.actions}>
        <Button
          variant="contained"
          onClick={submit}
          disabled={isSubmitting || isAwaitingReview}
        >
          {isSubmitting ? <div className="spinner" /> : t('submit')}
        </Button>
      </div>
    </div>
  );
}
