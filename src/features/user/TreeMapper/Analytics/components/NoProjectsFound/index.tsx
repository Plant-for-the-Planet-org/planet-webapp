import { ReactElement } from 'react';
import { Button } from '@mui/material';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import CenteredContainer from '../../../../../common/Layout/CenteredContainer';

const NoProjectsFound = (): ReactElement | null => {
  const { t, ready } = useTranslation('treemapperAnalytics');

  if (ready) {
    return (
      <CenteredContainer>
        <p className="centered-text">{t('noProjectsText')}</p>
        <Link href="/profile/projects">
          <Button variant="contained" color="primary">
            {t('addProjectsButton')}
          </Button>
        </Link>
      </CenteredContainer>
    );
  }

  return null;
};

export default NoProjectsFound;
