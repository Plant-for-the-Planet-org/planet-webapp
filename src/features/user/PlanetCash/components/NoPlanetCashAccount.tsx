import { ReactElement } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';
import CenteredContainer from '../../../common/Layout/CenteredContainer';

const NoPlanetCashAccount = (): ReactElement | null => {
  const t = useTranslations('Planetcash');
  const router = useRouter();

  const handleClick = () => {
    router.push('/profile/planetcash/new');
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
