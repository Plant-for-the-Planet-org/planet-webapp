import type { ReactElement } from 'react';

import { Button } from '@mui/material';
import { useTranslations } from 'next-intl';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import { useManagePayoutStore } from '../../../../stores';

const BankAccountsLoadError = (): ReactElement => {
  const t = useTranslations('ManagePayouts');
  // store: action
  const setAccountsStatus = useManagePayoutStore(
    (state) => state.setAccountsStatus
  );

  return (
    <CenteredContainer>
      <p className="centered-text">{t('bankAccountsLoadErrorText')}</p>
      <Button
        onClick={() => setAccountsStatus('idle')}
        variant="contained"
        color="primary"
      >
        {t('tryAgainButton')}
      </Button>
    </CenteredContainer>
  );
};

export default BankAccountsLoadError;
