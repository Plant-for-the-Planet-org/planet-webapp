import type { TabItem } from '../../common/Layout/TabbedView/TabbedViewTypes';
import type { PlanetCashAccount } from '../../common/types/planetcash';
import type { ReactElement } from 'react';

import { useState, useEffect, useCallback } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import DashboardView from '../../common/Layout/DashboardView';
import TabbedView from '../../common/Layout/TabbedView';
import CreateAccount from './screens/CreateAccount';
import Accounts from './screens/Accounts';
import Transactions from './screens/Transactions';
import { useApi } from '../../../hooks/useApi';
import useLocalizedPath from '../../../hooks/useLocalizedPath';
import { useRouter } from 'next/router';
import { useAuthStore, usePlanetCashStore } from '../../../stores';

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
  const t = useTranslations('PlanetCash');
  const { getApiAuthenticated } = useApi();
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  const locale = useLocale();
  // local state
  const [tabConfig, setTabConfig] = useState<TabItem[]>([]);
  // store: state
  const planetCashAccounts = usePlanetCashStore(
    (state) => state.planetCashAccounts
  );
  const status = usePlanetCashStore((state) => state.status);
  const isAuthReady = useAuthStore(
    (state) => state.token !== null && state.isAuthResolved
  );
  // store: action
  const fetchPlanetCashAccounts = usePlanetCashStore(
    (state) => state.fetchPlanetCashAccounts
  );

  // Redirect routes based on whether at least one account is created.
  // Prevents multiple account creation.
  const redirectIfNeeded = useCallback(
    (accounts: PlanetCashAccount[]) => {
      switch (step) {
        case PlanetCashTabs.CREATE_ACCOUNT:
          if (accounts.length) {
            router.push(localizedPath('/profile/planetcash'));
          }
          break;
        case PlanetCashTabs.ACCOUNTS:
        case PlanetCashTabs.TRANSACTIONS:
          if (!accounts.length) {
            router.push(localizedPath('/profile/planetcash/new'));
          }
          break;
        default:
          break;
      }
    },
    [step]
  );

  useEffect(() => {
    if (!isAuthReady || status !== 'idle') return;
    setProgress && setProgress(70);
    fetchPlanetCashAccounts(getApiAuthenticated).finally(() => {
      if (setProgress) {
        setProgress(100);
        setTimeout(() => setProgress(0), 1000);
      }
    });
  }, [isAuthReady, status]);

  useEffect(() => {
    if (status === 'ready' && planetCashAccounts) {
      redirectIfNeeded(planetCashAccounts);
    }
  }, [status, planetCashAccounts, redirectIfNeeded]);

  const renderStep = () => {
    switch (step) {
      case PlanetCashTabs.TRANSACTIONS:
        return <Transactions setProgress={setProgress} />;
      case PlanetCashTabs.CREATE_ACCOUNT:
        return <CreateAccount />;
      case PlanetCashTabs.ACCOUNTS:
      default:
        return <Accounts />;
    }
  };
  useEffect(() => {
    if (planetCashAccounts) {
      if (!planetCashAccounts.length) {
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
  }, [planetCashAccounts, locale]);

  return (
    <DashboardView
      title={t('title')}
      subtitle={
        <div>
          <p>
            {t.rich('partnerSignupInfo', {
              partnerEmailLink: (chunks) => (
                <a
                  className="planet-links"
                  href="mailto:partner@plant-for-the-planet.org"
                >
                  {chunks}
                </a>
              ),
            })}
          </p>
          <p>
            {t('description')}{' '}
            <a
              className="planet-links"
              href={`https://pp.eco/${locale}/planetcash/`}
              target="_blank"
              rel="noreferrer"
            >
              {t('learnMoreText')}
            </a>
            <br />
            <a
              className="planet-links"
              href={`https://pp.eco/legal/${locale}/terms`}
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
  );
}
