import { ReactElement } from 'react';
import { Button } from '@mui/material';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import CenteredContainer from '../../../../../common/Layout/CenteredContainer';

const NoProjectsFound = (): ReactElement | null => {
  const t = useTranslations('TreemapperAnalytics');

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
};

export default NoProjectsFound;
