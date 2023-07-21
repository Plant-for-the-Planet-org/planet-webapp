import { ReactElement } from 'react';
import { Button } from '@mui/material';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import CenteredContainer from '../../../common/Layout/CenteredContainer';

const NoBankAccount = (): ReactElement | null => {
  const { t, ready } = useTranslation('managePayouts');

  if (ready) {
    return (
      <CenteredContainer>
        <p className="centered-text">{t('noBankAccountText')}</p>
        <Link href="/profile/payouts/add-bank-details">
          <Button variant="contained" color="primary">
            {t('addBankDetailsButton')}
          </Button>
        </Link>
      </CenteredContainer>
    );
  }

  return null;
};

export default NoBankAccount;
