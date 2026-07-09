import type { TabItem } from '../../common/Layout/TabbedView/TabbedViewTypes';
import type { APIError } from '@planet-sdk/common';
import type { PlanetCashAccount } from '../../common/types/planetcash';
import type { ReactElement } from 'react';

import { useState, useEffect, useCallback } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import DashboardView from '../../common/Layout/DashboardView';
import TabbedView from '../../common/Layout/TabbedView';
import CreateAccount from './screens/CreateAccount';
import Accounts from './screens/Accounts';
import Transactions from './screens/Transactions';
import { useUserProps } from '../../common/Layout/UserPropsContext';
import { usePlanetCash } from '../../common/Layout/PlanetCashContext';
import { handleError } from '@planet-sdk/common';
import { useApi } from '../../../hooks/useApi';
import useLocalizedPath from '../../../hooks/useLocalizedPath';
import { useRouter } from 'next/router';
import { useErrorHandlingStore } from '../../../stores/errorHandlingStore';

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
  const { token, contextLoaded } = useUserProps();
  const { accounts, setAccounts, setIsPlanetCashActive } = usePlanetCash();
  // local state
  const [tabConfig, setTabConfig] = useState<TabItem[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  // store
  const setErrors = useErrorHandlingStore((state) => state.setErrors);

  const sortAccountsByActive = (
    accounts: PlanetCashAccount[]
  ): PlanetCashAccount[] => {
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

  const fetchAccounts = useCallback(async () => {
    if (!accounts) {
      try {
        setIsDataLoading(true);
        setProgress && setProgress(70);
        const accounts = await getApiAuthenticated<PlanetCashAccount[]>(
          '/app/planetCash'
        );
        redirectIfNeeded(accounts);
        const sortedAccounts = sortAccountsByActive(accounts);
        setIsPlanetCashActive(accounts.some((account) => account.isActive));
        setAccounts(sortedAccounts);
      } catch (err) {
        setErrors(handleError(err as APIError));
      }
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
    if (accounts) {
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
  }, [accounts, locale]);

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
