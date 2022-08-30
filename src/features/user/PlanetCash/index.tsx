import { ReactElement, useState, useEffect } from 'react';
import i18next from '../../../../i18n';
import DashboardView from '../../common/Layout/DashboardView';
import TabbedView from '../../common/Layout/TabbedView';
import { TabItem } from '../../common/Layout/TabbedView/TabbedViewTypes';
import CreateAccount from './screens/CreateAccount';
import Accounts from './screens/Accounts';
import Transactions from './screens/Transactions';

export enum PlanetCashTabs {
  CREATE_ACCOUNT = 0,
  ACCOUNTS = 1,
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

  const renderStep = () => {
    switch (step) {
      case PlanetCashTabs.CREATE_ACCOUNT:
        return <CreateAccount />;
      case PlanetCashTabs.ACCOUNTS:
        return <Accounts />;
      case PlanetCashTabs.TRANSACTIONS:
        return <Transactions setProgress={setProgress} />;
      default:
        return <Accounts />;
    }
  };

  useEffect(() => {
    if (ready) {
      setTabConfig([
        {
          label: t('tabCreateAccount'),
          link: '/profile/planetcash/new',
        },
        {
          label: t('tabAccount'),
          link: '/profile/planetcash',
          hasList: true,
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
