import type { ReactElement } from 'react';

import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';
import WebappButton from '../../common/WebappButton';
import styles from './TreemapperMigration.module.scss';

/**
 * Renders the migration landing card directing users to the new TreeMapper dashboard.
 */
const TreemapperMigration = (): ReactElement => {
  const t = useTranslations('Treemapper');

  return (
    <section className={styles.container}>
      <div className={styles.card}>
        <Typography variant="h2" color="white">
          {t('migrationTitle')}
        </Typography>
        <Typography variant="body1" color="white">
          {t('migrationSubtitle')}
        </Typography>
        <WebappButton
          elementType="link"
          href="https://dash.treemapper.app/"
          target="_blank"
          variant="primary"
          text={t('openDashboard')}
        />
        <a
          className={styles.supportLink}
          href="mailto:support@plant-for-the-planet.org"
        >
          {t('contactSupport')}
        </a>
      </div>
    </section>
  );
};

export default TreemapperMigration;
