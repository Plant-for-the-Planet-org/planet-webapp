import { ReactElement } from 'react';
import { Button } from '@mui/material';
import i18next from '../../../../../i18n';
import { useRouter } from 'next/router';
import CenteredContainer from '../../../common/Layout/CenteredContainer';

const { useTranslation } = i18next;

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
