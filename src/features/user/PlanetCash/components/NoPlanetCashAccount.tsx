import type { ReactElement } from 'react';

import { useTranslations } from 'next-intl';
import { Button } from '@mui/material';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import useLocalizedPath from '../../../../hooks/useLocalizedPath';
import { useRouter } from 'next/router';

const NoPlanetCashAccount = (): ReactElement | null => {
  const t = useTranslations('PlanetCash');
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();

  return (
    <CenteredContainer>
      <p className="centered-text">{t('noAccountsText')}</p>
      <Button
        variant="contained"
        color="primary"
        onClick={() => router.push(localizedPath('/profile/planetcash/new'))}
      >
        {t('createPlanetCashButton')}
      </Button>
    </CenteredContainer>
  );
};

export default NoPlanetCashAccount;
