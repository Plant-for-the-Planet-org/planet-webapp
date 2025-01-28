import type { ReactElement } from 'react';

import { Button } from '@mui/material';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import CenteredContainer from '../../../common/Layout/CenteredContainer';

const NoBankAccount = (): ReactElement | null => {
  const t = useTranslations('ManagePayouts');

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
};

export default NoBankAccount;
