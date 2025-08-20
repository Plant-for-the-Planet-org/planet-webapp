import type { ReactElement } from 'react';

import { useTranslations } from 'next-intl';
import { Button } from '@mui/material';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import useLocalizedRouter from '../../../../hooks/useLocalizedRouter';

const NoPlanetCashAccount = (): ReactElement | null => {
  const t = useTranslations('PlanetCash');
  const { push } = useLocalizedRouter();

  return (
    <CenteredContainer>
      <p className="centered-text">{t('noAccountsText')}</p>
      <Button
        variant="contained"
        color="primary"
        onClick={() => push('/profile/planetcash/new')}
      >
        {t('createPlanetCashButton')}
      </Button>
    </CenteredContainer>
  );
};

export default NoPlanetCashAccount;
