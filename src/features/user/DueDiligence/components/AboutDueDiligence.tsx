import type { ReactElement } from 'react';

import { useTranslations } from 'next-intl';
import styles from '../DueDiligence.module.scss';

/**
 * Both numbers belong to the backend and neither is in the checklist response, so they are repeated here.
 * `CharitabilityRecorder::VALIDITY_YEARS` and `RoOnboardingEmailPlanner::RENEWAL_NOTICE_MONTHS` are what the renewal email actually follows.
 */
const VALIDITY_YEARS = 2;
const RENEWAL_NOTICE_MONTHS = 2;

const SUPPORT_EMAIL = 'maximilian.schmid@plant-for-the-planet.org';

/**
 * What an organisation has to know before it reads the checklist.
 *
 * Always shown, unlike the standing below it. The point about donations is the reason for that: an organisation whose projects take no donations sees a list of six missing documents, and without this it has no way to tell that it is not behind on anything.
 */
export default function AboutDueDiligence(): ReactElement {
  const t = useTranslations('Me.dueDiligence');

  return (
    <aside className={styles.callout}>
      <p>{t('calloutWhat')}</p>
      <p>
        {t('calloutRenewal', {
          years: VALIDITY_YEARS,
          months: RENEWAL_NOTICE_MONTHS,
        })}
      </p>
      <p>{t('calloutWhenItMatters')}</p>
      <p>
        {t.rich('calloutContact', {
          link: (chunks) => <a href={`mailto:${SUPPORT_EMAIL}`}>{chunks}</a>,
        })}
      </p>
    </aside>
  );
}
