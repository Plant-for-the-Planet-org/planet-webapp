import type { ReactElement } from 'react';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import styles from './TreemapperMigration.module.scss';

const TreemapperMigration = (): ReactElement => {
  return (
    <section className={styles.container}>
      <div className={styles.card}>
        <Typography variant="h2" color="white">
          Your Data Has Been Successfully Migrated.
        </Typography>
        <Typography variant="body1" color="white">
          All your project and site data is now available in the new Data
          Explorer.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          href="https://dash.treemapper.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open Dashboard
        </Button>
        <Link
          className={styles.supportLink}
          href="mailto:support@plant-for-the-planet.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Contact Support
        </Link>
      </div>
    </section>
  );
};

export default TreemapperMigration;
