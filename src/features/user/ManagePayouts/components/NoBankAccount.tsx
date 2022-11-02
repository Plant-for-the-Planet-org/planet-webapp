import { ReactElement } from 'react';
import { Button } from '@mui/material';
import i18next from '../../../../../i18n';
import Link from 'next/link';
import CenteredContainer from '../../../common/Layout/CenteredContainer';

const { useTranslation } = i18next;

const NoBankAccount = (): ReactElement | null => {
  const { t, ready } = useTranslation('managePayouts');

  if (ready) {
    return (
      <CenteredContainer>
        <p className="centered-text">{t('noBankAccountText')}</p>
        <Link href="/profile/payouts/add-bank-details" passHref>
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
