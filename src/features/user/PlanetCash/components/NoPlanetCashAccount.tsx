import type { ReactElement } from 'react';

import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import getLocalizedPath from '../../../../utils/localizedPath';

const NoPlanetCashAccount = (): ReactElement | null => {
  const t = useTranslations('PlanetCash');
  const router = useRouter();
  const locale = useLocale();

  const handleClick = () => {
    router.push(getLocalizedPath('/profile/planetcash/new', locale));
  };

  return (
    <CenteredContainer>
      <p className="centered-text">{t('noAccountsText')}</p>
      <Button variant="contained" color="primary" onClick={handleClick}>
        {t('createPlanetCashButton')}
      </Button>
    </CenteredContainer>
  );
};

export default NoPlanetCashAccount;
