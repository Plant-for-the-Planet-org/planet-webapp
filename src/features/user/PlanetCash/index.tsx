import { ReactElement, useState, useEffect } from 'react';
import i18next from '../../../../i18n';
import DashboardView from '../../common/Layout/DashboardView';
import TabbedView from '../../common/Layout/TabbedView';
import { TabItem } from '../../common/Layout/TabbedView/TabbedViewTypes';
import Account from './screens/Account';
import Transactions from './screens/Transactions';

export enum PlanetCashTabs {
  ACCOUNT = 0,
  TRANSACTIONS = 1,
}

const { useTranslation } = i18next;

interface PlanetCashProps {
  step: PlanetCashTabs;
}

export default function PlanetCash({
  step,
}: PlanetCashProps): ReactElement | null {
  const { t, ready } = useTranslation('planetcash');
  const [tabConfig, setTabConfig] = useState<TabItem[]>([]);

  const renderStep = () => {
    switch (step) {
      case PlanetCashTabs.ACCOUNT:
        return <Account />;
      case PlanetCashTabs.TRANSACTIONS:
        return <Transactions />;
      default:
        return <Account />;
    }
  };

  useEffect(() => {
    if (ready) {
      setTabConfig([
        {
          label: t('tabAccount'),
          link: '/profile/planetcash',
        },
        {
          label: t('tabTransactions'),
          link: '/profile/planetcash/transactions',
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
      <TabbedView step={step} tabItems={tabConfig}>
        {renderStep()}
      </TabbedView>
    </DashboardView>
  ) : null;
}
