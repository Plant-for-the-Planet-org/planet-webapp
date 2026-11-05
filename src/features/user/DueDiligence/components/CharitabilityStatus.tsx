import type { ReactElement } from 'react';
import type { DueDiligenceCharitability } from '../../../common/types/dueDiligence';

import { Alert } from '@mui/material';
import { useTranslations, useFormatter } from 'next-intl';
import { standingOf } from '../utils/status';

interface Props {
  charitability: DueDiligenceCharitability;
}

/**
 * Where the organisation stands, which the checklist alone cannot say.
 *
 * Feedback sits alongside the standing rather than replacing it: an
 * organisation whose confirmation is still valid can be asked for a missing
 * document towards the next renewal, and both are true at once.
 */
export default function CharitabilityStatus({
  charitability,
}: Props): ReactElement {
  const t = useTranslations('Me.dueDiligence');
  const format = useFormatter();

  const standing = standingOf(charitability);
  const date = standing.date
    ? format.dateTime(new Date(standing.date), { dateStyle: 'long' })
    : '';

  return (
    <>
      <Alert severity={standing.severity}>
        {t(standing.messageKey, { until: date, since: date })}
      </Alert>
      {charitability.feedback && (
        <Alert severity="warning">
          {t('reviewerFeedback')}: {charitability.feedback}
        </Alert>
      )}
    </>
  );
}
