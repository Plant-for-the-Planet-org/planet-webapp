import type { ReactElement } from 'react';

import { useTranslations } from 'next-intl';
import { Button } from '@mui/material';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import { usePlanetCashStore } from '../../../../stores';

const PlanetCashLoadError = (): ReactElement => {
  const t = useTranslations('PlanetCash');
  // store: action
  const retryFetchAfterError = usePlanetCashStore(
    (state) => state.retryFetchAfterError
  );

  return (
    <CenteredContainer>
      <p className="centered-text">{t('loadAccountsError')}</p>
      <Button
        variant="contained"
        color="primary"
        onClick={retryFetchAfterError}
      >
        {t('tryAgainButton')}
      </Button>
    </CenteredContainer>
  );
};

export default PlanetCashLoadError;
