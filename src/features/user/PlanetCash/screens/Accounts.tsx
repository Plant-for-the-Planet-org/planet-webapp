import type { ReactElement } from 'react';

import { useTranslations } from 'next-intl';
import AccountListLoader from '../../../../../public/assets/images/icons/AccountListLoader';
import AccountDetails from '../components/AccountDetails';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import { usePlanetCashStore } from '../../../../stores';
import NoPlanetCashAccount from '../components/NoPlanetCashAccount';

const Accounts = (): ReactElement | null => {
  const t = useTranslations('PlanetCash');
  const planetCashAccounts = usePlanetCashStore(
    (state) => state.planetCashAccounts
  );
  const status = usePlanetCashStore((state) => state.status);

  if (status === 'idle' || status === 'loading') return <AccountListLoader />;

  if (status === 'error') {
    return (
      <CenteredContainer>
        <p className="centered-text">{t('loadAccountsError')}</p>
      </CenteredContainer>
    );
  }

  if (planetCashAccounts && planetCashAccounts.length > 0) {
    return (
      <>
        {planetCashAccounts.map((account, index) => (
          <AccountDetails account={account} key={index} />
        ))}
      </>
    );
  }

  // This will not normally be seen, as the page redirects to create a new account once the fetch confirms the list is empty.
  return <NoPlanetCashAccount />;
};

export default Accounts;
