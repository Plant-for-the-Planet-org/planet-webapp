import { ReactElement, useState, useEffect } from 'react';
import i18next from '../../../../i18n';
import DashboardView from '../../common/Layout/DashboardView';
import TabbedView from '../../common/Layout/TabbedView';
import { TabItem } from '../../common/Layout/TabbedView/TabbedViewTypes';

import PayoutScheduleForm from './PayoutScheduleForm';
import BankDetailsForm from './BankDetailsForm';
import Overview from './Overview';

const { useTranslation } = i18next;

export enum ManagePayoutSteps {
  OVERVIEW = 0,
  PAYOUT_SCHEDULE = 1,
  ADD_BANK_DETAILS = 2,
}

interface ManagePayoutsProps {
  step: number;
}

export default function ManagePayouts({
  step,
}: ManagePayoutsProps): ReactElement | null {
  const { t, ready } = useTranslation('managePayouts');
  const [tabConfig, setTabConfig] = useState<TabItem[]>([]);

  useEffect(() => {
    if (ready) {
      setTabConfig([
        {
          label: t('tabOverview'),
          link: '/profile/payouts',
        },
        {
          label: t('tabPayoutSchedule'),
          link: '/profile/payouts/schedule',
        },
        {
          label: t('tabBankDetails'),
          link: '/profile/payouts/add-bank-details',
        },
      ]);
    }
  }, [ready]);

  const renderStep = () => {
    switch (step) {
      case ManagePayoutSteps.PAYOUT_SCHEDULE:
        return <PayoutScheduleForm />;
      case ManagePayoutSteps.ADD_BANK_DETAILS:
        return <BankDetailsForm />;
      case ManagePayoutSteps.OVERVIEW:
      default:
        return <Overview />;
    }
  };

  return ready ? (
    <DashboardView title={t('title')} subtitle={<p>{t('description')}</p>}>
      <TabbedView step={step} tabItems={tabConfig}>
        {renderStep()}
      </TabbedView>
    </DashboardView>
  ) : null;
}
