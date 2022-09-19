import {
  ReactElement,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import { useTranslation } from 'next-i18next';
import DashboardView from '../../common/Layout/DashboardView';
import TabbedView from '../../common/Layout/TabbedView';
import { TabItem } from '../../common/Layout/TabbedView/TabbedViewTypes';
import CreateAccount from './screens/CreateAccount';
import Accounts from './screens/Accounts';
import Transactions from './screens/Transactions';
import { getAuthenticatedRequest } from '../../../utils/apiRequests/api';
import { UserPropsContext } from '../../common/Layout/UserPropsContext';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import { usePlanetCash } from '../../common/Layout/PlanetCashContext';

export enum PlanetCashTabs {
  ACCOUNTS = 0,
  CREATE_ACCOUNT = 1,
  TRANSACTIONS = 2,
}

interface PlanetCashProps {
  step: PlanetCashTabs;
  setProgress?: (progress: number) => void;
  shouldReload?: boolean;
}

export default function PlanetCash({
  step,
  setProgress,
  shouldReload = false,
}: PlanetCashProps): ReactElement | null {
  const { t, ready } = useTranslation('planetcash');
  const [tabConfig, setTabConfig] = useState<TabItem[]>([]);
  const { token, contextLoaded } = useContext(UserPropsContext);
  const { accounts, setAccounts, setIsPlanetCashActive } = usePlanetCash();
  const { handleError } = useContext(ErrorHandlingContext);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const fetchAccounts = useCallback(async () => {
    if (!accounts || shouldReload) {
      setIsDataLoading(true);
      setProgress && setProgress(70);
      const accounts = await getAuthenticatedRequest<PlanetCash.Account[]>(
        `/app/planetCash`,
        token,
        {},
        handleError
      );
      const sortedAccounts = sortAccountsByActive(accounts);
      setIsPlanetCashActive(accounts.some((account) => account.isActive));
      setAccounts(sortedAccounts);
      setIsDataLoading(false);

      if (setProgress) {
        setProgress(100);
        setTimeout(() => setProgress(0), 1000);
      }
    }
  }, [shouldReload]);

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
        return <Accounts isDataLoading={isDataLoading} />;
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
            href="https://www.plant-for-the-planet.org/planetcash/"
            target="_blank"
            rel="noreferrer"
          >
            {t('learnMoreText')}
          </a>
          <br />
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
