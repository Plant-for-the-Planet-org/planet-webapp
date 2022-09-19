import { ReactElement } from 'react';
import { Button, styled } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

const Container = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: 24,
  borderRadius: 9,
  boxShadow: theme.shadows[1],
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
  textAlign: 'center',
  alignItems: 'center',
  justifyContent: 'space-around',
  fontSize: '1rem',
}));

const NoPlanetCashAccount = (): ReactElement | null => {
  const { t, ready } = useTranslation('planetcash');
  const router = useRouter();

  const handleClick = () => {
    router.push('/profile/planetcash/new');
  };

  if (ready) {
    return (
      <Container>
        <p>{t('noAccountsText')}</p>
        <Button variant="contained" color="primary" onClick={handleClick}>
          {t('createPlanetCashButton')}
        </Button>
      </Container>
    );
  }

  return null;
};

export default NoPlanetCashAccount;
