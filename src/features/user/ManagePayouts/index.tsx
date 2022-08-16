import { ReactElement, useState, useEffect } from 'react';
import i18next from '../../../../i18n';
import DashboardView from '../../common/Layout/DashboardView';
import TabbedView from '../../common/Layout/TabbedView';
import { TabItem } from '../../common/Layout/TabbedView/TabbedViewTypes';

import PayoutScheduleForm from './PayoutScheduleForm';
import BankDetailsForm from './BankDetailsForm';

const { useTranslation } = i18next;

export enum ManagePayoutSteps {
  PAYOUT_SCHEDULE = 0,
  BANK_DETAILS = 1,
}

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

  const renderStep = () => {
    switch (step) {
      case ManagePayoutSteps.PAYOUT_SCHEDULE:
        return <PayoutScheduleForm />;
      case ManagePayoutSteps.BANK_DETAILS:
        return <BankDetailsForm />;
      default:
        return <PayoutScheduleForm />;
        break;
    }
  };

  return ready ? (
    <DashboardView
      title={t('managePayouts.title')}
      subtitle={<p>{t('managePayouts.description')}</p>}
    >
      <TabbedView step={step} tabItems={tabConfig}>
        {renderStep()}
      </TabbedView>
    </DashboardView>
  ) : null;
}
