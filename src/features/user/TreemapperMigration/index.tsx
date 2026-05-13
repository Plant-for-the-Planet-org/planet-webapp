import type { ReactElement } from 'react';

import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import WebappButton from '../../common/WebappButton';
import styles from './TreemapperMigration.module.scss';
import Image from 'next/image';

const DASHBOARD_URLS: Record<string, string> = {
  'plant-locations': 'https://dash.treemapper.app/dashboard/intervention',
  'data-explorer': 'https://dash.treemapper.app/dashboard/overview',
  'my-species': 'https://dash.treemapper.app/dashboard/species',
  import: 'https://dash.treemapper.app/dashboard/bulkupload',
};

const DEFAULT_DASHBOARD_URL = 'https://dash.treemapper.app/';

/**
 * Renders the migration landing card directing users to the new TreeMapper dashboard.
 */
const TreemapperMigration = (): ReactElement => {
  const t = useTranslations('Treemapper');
  const router = useRouter();

  const source = typeof router.query.source === 'string'
    ? router.query.source
    : undefined;

  const dashboardUrl = (source && DASHBOARD_URLS[source]) || DEFAULT_DASHBOARD_URL;

  return (
    <section className={styles.container}>
      <div className={styles.card}>
        <Image
          src="/assets/images/treemapper/migration-graphics.webp"
          alt=""
          role="presentation"
          width={240}
          height={210}
        />
        <Typography variant="h2">{t('migrationTitle')}</Typography>
        <Typography variant="body1">{t('migrationSubtitle')}</Typography>
        <WebappButton
          elementType="link"
          href={dashboardUrl}
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
