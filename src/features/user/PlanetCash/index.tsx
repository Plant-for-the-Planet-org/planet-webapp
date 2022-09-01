import { ReactElement, useState, useEffect, useContext } from 'react';
import i18next from '../../../../i18n';
import DashboardView from '../../common/Layout/DashboardView';
import TabbedView from '../../common/Layout/TabbedView';
import { TabItem } from '../../common/Layout/TabbedView/TabbedViewTypes';
import CreateAccount from './screens/CreateAccount';
import Accounts from './screens/Accounts';
import Transactions from './screens/Transactions';
import { getAuthenticatedRequest } from '../../../utils/apiRequests/api';
import { UserPropsContext } from '../../common/Layout/UserPropsContext';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';

export enum PlanetCashTabs {
  ACCOUNTS = 0,
  CREATE_ACCOUNT = 1,
  TRANSACTIONS = 2,
}

const { useTranslation } = i18next;

interface PlanetCashProps {
  step: PlanetCashTabs;
  setProgress?: (progress: number) => void;
}

export default function PlanetCash({
  step,
  setProgress,
}: PlanetCashProps): ReactElement | null {
  const { t, ready } = useTranslation('planetcash');
  const [tabConfig, setTabConfig] = useState<TabItem[]>([]);
  const { token, contextLoaded } = useContext(UserPropsContext);
  const { handleError } = useContext(ErrorHandlingContext);
  const [accounts, setAccounts] = useState<PlanetCash.Account[] | null>(null);
  const [isPlanetCashActive, setIsPlanetCashActive] = useState(false);

  const fetchAccounts = async () => {
    const accounts = await getAuthenticatedRequest<PlanetCash.Account[]>(
      `/app/planetCash`,
      token,
      {},
      handleError
    );
    const sortedAccounts = sortAccountsByActive(accounts);
    setIsPlanetCashActive(accounts.some((account) => account.isActive));
    setAccounts(sortedAccounts);
  };

  const sortAccountsByActive = (
    accounts: PlanetCash.Account[]
  ): PlanetCash.Account[] => {
    return accounts.sort((accountA, accountB) => {
      if (accountA.isActive === accountB.isActive) {
        return 0;
      } else {
        return accountA.isActive ? -1 : 1;
      }
    });
  };

  useEffect(() => {
    if (contextLoaded && token) fetchAccounts();
  }, [contextLoaded, token]);

  const renderStep = () => {
    switch (step) {
      case PlanetCashTabs.TRANSACTIONS:
        return <Transactions setProgress={setProgress} />;
      case PlanetCashTabs.CREATE_ACCOUNT:
        return <CreateAccount />;
      case PlanetCashTabs.ACCOUNTS:
      default:
        return (
          <Accounts
            accounts={accounts}
            setAccounts={setAccounts}
            isPlanetCashActive={isPlanetCashActive}
            setIsPlanetCashActive={setIsPlanetCashActive}
          />
        );
    }
  };

  useEffect(() => {
    if (ready) {
      setTabConfig([
        {
          label: t('tabAccounts'),
          link: '/profile/planetcash',
          hasList: true,
        },
        {
          label: t('tabCreateAccount'),
          link: '/profile/planetcash/new',
        },
        {
          label: t('tabTransactions'),
          link: '/profile/planetcash/transactions',
          hasList: true,
        },
      ]);
    }
  }, [ready]);

  return ready ? (
    <DashboardView
      title={t('title')}
      subtitle={
        <p>
          {t('description')}{' '}
          <a
            className="planet-links"
            href="https://www.plant-for-the-planet.org/terms-and-conditions/"
            target="_blank"
            rel="noreferrer"
          >
            {t('termsText')}
          </a>
        </p>
      }
    >
      <TabbedView
        step={step}
        tabItems={tabConfig}
        isShowingList={tabConfig[step]?.hasList}
      >
        {renderStep()}
      </TabbedView>
    </DashboardView>
  ) : null;
}
