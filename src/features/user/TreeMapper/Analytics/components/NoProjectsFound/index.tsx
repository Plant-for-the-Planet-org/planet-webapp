import type { ReactElement } from 'react';

import { Button } from '@mui/material';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import CenteredContainer from '../../../../../common/Layout/CenteredContainer';
import useLocalizedPath from '../../../../../../hooks/useLocalizedPath';

const NoProjectsFound = (): ReactElement | null => {
  const t = useTranslations('TreemapperAnalytics');
  const { localizedPath } = useLocalizedPath();

  return (
    <CenteredContainer>
      <p className="centered-text">{t('noProjectsText')}</p>
      <Link href={localizedPath('/profile/projects')}>
        <Button variant="contained" color="primary">
          {t('addProjectsButton')}
        </Button>
      </Link>
    </CenteredContainer>
  );
};

export default NoProjectsFound;
