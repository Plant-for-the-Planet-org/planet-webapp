import { ReactElement } from 'react';
import { Button, styled } from '@mui/material';
import i18next from '../../../../../i18n';
import Link from 'next/link';

const { useTranslation } = i18next;

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

const NoBankAccount = (): ReactElement | null => {
  const { t, ready } = useTranslation('managePayouts');

  if (ready) {
    return (
      <Container>
        <p>{t('noBankAccountText')}</p>
        <Link href="/profile/payouts/add-bank-details" passHref>
          <Button variant="contained" color="primary">
            {t('addBankDetailsButton')}
          </Button>
        </Link>
      </Container>
    );
  }

  return null;
};

export default NoBankAccount;
