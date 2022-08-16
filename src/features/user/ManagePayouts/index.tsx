import { ReactElement, useState, useEffect } from 'react';
import i18next from '../../../../i18n';
import DashboardView from '../../common/Layout/DashboardView';
import TabbedView from '../../common/Layout/TabbedView';
import { TabItem } from '../../common/Layout/TabbedView/TabbedViewTypes';

const { useTranslation } = i18next;

interface ManagePayoutsProps {
  step: number;
}

export default function ManagePayouts({
  step,
}: ManagePayoutsProps): ReactElement | null {
  const { t, ready } = useTranslation('me');
  const [tabConfig, setTabConfig] = useState<TabItem[]>([]);

  useEffect(() => {
    if (ready) {
      setTabConfig([
        {
          label: t('managePayouts.tabPayoutSchedule'),
          link: '/profile/payouts',
        },
        {
          label: t('managePayouts.tabBankDetails'),
          link: '/profile/payouts/bank-details',
        },
      ]);
    }
  }, [ready]);

  return ready ? (
    <DashboardView
      title={t('managePayouts.title')}
      subtitle={<p>{t('managePayouts.description')}</p>}
    >
      <TabbedView step={step} tabItems={tabConfig}>
        Step {step}
      </TabbedView>
    </DashboardView>
  ) : null;
}
