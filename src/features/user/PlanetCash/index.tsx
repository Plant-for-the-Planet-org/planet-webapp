import { ReactElement, useState, useEffect } from 'react';
import i18next from '../../../../i18n';
import DashboardView from '../../common/Layout/DashboardView';
import TabbedView from '../../common/Layout/TabbedView';
import { TabItem } from '../../common/Layout/TabbedView/TabbedViewTypes';

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
          <a className="planet-links" href="" target="_blank">
            {t('termsText')}
          </a>
        </p>
      }
    >
      <TabbedView step={step} tabItems={tabConfig}>
        Step {step}
      </TabbedView>
    </DashboardView>
  ) : null;
}
