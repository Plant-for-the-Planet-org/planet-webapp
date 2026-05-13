import type { ReactElement } from 'react';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';
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
        <Button
          variant="contained"
          color="primary"
          href="https://dash.treemapper.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('openDashboard')}
        </Button>
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
