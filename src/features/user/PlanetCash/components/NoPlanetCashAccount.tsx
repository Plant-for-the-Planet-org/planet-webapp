import { ReactElement } from 'react';
import { useTranslation } from 'next-i18next';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';
import CenteredContainer from '../../../common/Layout/CenteredContainer';

const NoPlanetCashAccount = (): ReactElement | null => {
  const { t, ready } = useTranslation('planetcash');
  const router = useRouter();

  const handleClick = () => {
    router.push('/profile/planetcash/new');
  };

  if (ready) {
    return (
      <CenteredContainer>
        <p className="centered-text">{t('noAccountsText')}</p>
        <Button variant="contained" color="primary" onClick={handleClick}>
          {t('createPlanetCashButton')}
        </Button>
      </CenteredContainer>
    );
  }

  return null;
};

export default NoPlanetCashAccount;
