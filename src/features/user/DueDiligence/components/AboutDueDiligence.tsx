import type { ReactElement } from 'react';

import { useTranslations } from 'next-intl';
import styles from '../DueDiligence.module.scss';

/**
 * The three things an organisation has to know before it reads the checklist.
 *
 * Always shown, unlike the standing below it. The point about donations is the
 * reason for that: an organisation whose projects take no donations sees a list
 * of six missing documents, and without this it has no way to tell that it is
 * not behind on anything.
 */
export default function AboutDueDiligence(): ReactElement {
  const t = useTranslations('Me.dueDiligence');

  return (
    <aside className={styles.callout}>
      <p>{t('calloutWhat')}</p>
      <p>{t('calloutRenewal')}</p>
      <p>{t('calloutWhenItMatters')}</p>
    </aside>
  );
}
