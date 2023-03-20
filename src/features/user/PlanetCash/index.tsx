import {
  ReactElement,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import { Trans, useTranslation } from 'next-i18next';
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
import { useRouter } from 'next/router';

export enum PlanetCashTabs {
  ACCOUNTS = 'accounts',
  CREATE_ACCOUNT = 'create_account',
  TRANSACTIONS = 'transactions',
}

interface PlanetCashProps {
  step: PlanetCashTabs;
  setProgress?: (progress: number) => void;
}

export default function PlanetCash({
  step,
  setProgress,
}: PlanetCashProps): ReactElement | null {
  const { t, ready, i18n } = useTranslation('planetcash');
  const [tabConfig, setTabConfig] = useState<TabItem[]>([]);
  const { token, contextLoaded, impersonatedEmail } =
    useContext(UserPropsContext);
  const { accounts, setAccounts, setIsPlanetCashActive } = usePlanetCash();
  const { handleError } = useContext(ErrorHandlingContext);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const router = useRouter();

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

  // Redirect routes based on whether at least one account is created.
  // Prevents multiple account creation.
  const redirectIfNeeded = useCallback(
    (accounts) => {
      switch (step) {
        case PlanetCashTabs.CREATE_ACCOUNT:
          if (accounts.length) {
            router.push('/profile/planetcash');
          }
          break;
        case PlanetCashTabs.ACCOUNTS:
        case PlanetCashTabs.TRANSACTIONS:
          if (!accounts.length) {
            router.push('/profile/planetcash/new');
          }
          break;
        default:
          break;
      }
    },
    [step]
  );

  const fetchAccounts = useCallback(async () => {
    if (!accounts) {
      setIsDataLoading(true);
      setProgress && setProgress(70);
      const accounts = await getAuthenticatedRequest<PlanetCash.Account[]>(
        `/app/planetCash`,
        token,
        impersonatedEmail,
        {},
        handleError
      );
      redirectIfNeeded(accounts);
      const sortedAccounts = sortAccountsByActive(accounts);
      setIsPlanetCashActive(accounts.some((account) => account.isActive));
      setAccounts(sortedAccounts);
      setIsDataLoading(false);

      if (setProgress) {
        setProgress(100);
        setTimeout(() => setProgress(0), 1000);
      }
    } else {
      redirectIfNeeded(accounts);
    }
  }, [accounts]);

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
    if (ready && accounts) {
      if (!accounts.length) {
        setTabConfig([
          {
            label: t('tabCreateAccount'),
            link: '/profile/planetcash/new',
            step: PlanetCashTabs.CREATE_ACCOUNT,
          },
        ]);
      } else
        setTabConfig([
          {
            label: t('tabAccounts'),
            link: '/profile/planetcash',
            step: PlanetCashTabs.ACCOUNTS,
          },
          {
            label: t('tabTransactions'),
            link: '/profile/planetcash/transactions',
            step: PlanetCashTabs.TRANSACTIONS,
          },
        ]);
    }
  }, [ready, accounts, i18n.language]);

  return ready ? (
    <DashboardView
      title={t('title')}
      subtitle={
        <div>
          <p>
            <Trans i18nKey="planetcash:partnerSignupInfo">
              Use of this feature by Companies is subject to partnership with
              Plant-for-the-Planet. Please contact{' '}
              <a
                className="planet-links"
                href="mailto:partner@plant-for-the-planet.org"
              >
                partner@plant-for-the-planet.org
              </a>{' '}
              for details.
            </Trans>
          </p>
          <p>
            {t('description')}{' '}
            <a
              className="planet-links"
              href={`https://pp.eco/${i18n.language}/planetcash/`}
              target="_blank"
              rel="noreferrer"
            >
              {t('learnMoreText')}
            </a>
            <br />
            <a
              className="planet-links"
              href={`https://pp.eco/legal/${i18n.language}/terms`}
              target="_blank"
              rel="noreferrer"
            >
              {t('termsText')}
            </a>
          </p>
        </div>
      }
    >
      <TabbedView step={step} tabItems={tabConfig}>
        {renderStep()}
      </TabbedView>
    </DashboardView>
  ) : null;
}
