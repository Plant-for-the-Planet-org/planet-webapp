import type { ReactElement } from 'react';
import type { TabItem } from '../../common/Layout/TabbedView/TabbedViewTypes';
import type { APIError } from '@planet-sdk/common';
import type { BankAccount, PayoutMinAmounts } from '../../common/types/payouts';

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import DashboardView from '../../common/Layout/DashboardView';
import TabbedView from '../../common/Layout/TabbedView';
import PayoutScheduleForm from './screens/PayoutScheduleForm';
import Overview from './screens/Overview';
import EditBankAccount from './screens/EditBankAccount';
import AddBankAccount from './screens/AddBankAccount';
import { useRouter } from 'next/router';
import { handleError } from '@planet-sdk/common';
import { useApi } from '../../../hooks/useApi';
import useLocalizedPath from '../../../hooks/useLocalizedPath';
import {
  useAuthStore,
  useUserStore,
  useErrorHandlingStore,
  useManagePayoutStore,
} from '../../../stores';
import { useShallow } from 'zustand/react/shallow';

export enum ManagePayoutTabs {
  OVERVIEW = 'overview',
  PAYOUT_SCHEDULE = 'payout_schedule',
  ADD_BANK_DETAILS = 'add_bank_details',
}

interface ManagePayoutsProps {
  step: ManagePayoutTabs;
  setProgress?: (progress: number) => void;
  isEdit?: boolean;
}

export default function ManagePayouts({
  step,
  setProgress,
  isEdit,
}: ManagePayoutsProps): ReactElement | null {
  const t = useTranslations('ManagePayouts');
  const locale = useLocale();
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  const { getApi, getApiAuthenticated } = useApi();
  // local state
  const [tabConfig, setTabConfig] = useState<TabItem[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  // store: state
  const isAuthReady = useAuthStore(
    (state) => state.token !== null && state.isAuthResolved
  );
  const { userId, isTpo } = useUserStore(
    useShallow((state) => ({
      userId: state.userProfile?.id,
      isTpo: state.userProfile?.type === 'tpo',
    }))
  );
  const hasAccounts = useManagePayoutStore(
    (state) => state.accounts !== null && state.accounts?.length > 0
  );
  const hasPayoutMinAmounts = useManagePayoutStore(
    (state) => state.payoutMinAmounts !== null
  );
  // store: action
  const setErrors = useErrorHandlingStore((state) => state.setErrors);
  const setAccounts = useManagePayoutStore((state) => state.setAccounts);
  const setPayoutMinAmounts = useManagePayoutStore(
    (state) => state.setPayoutMinAmounts
  );

  const fetchPayoutMinAmounts = async () => {
    if (hasPayoutMinAmounts) return;

    try {
      const res = await getApi<PayoutMinAmounts>('/app/payoutMinAmounts');
      setPayoutMinAmounts(res);
    } catch (err) {
      setErrors(handleError(err as APIError));
    }
  };

  useEffect(() => {
    if (!hasPayoutMinAmounts && isTpo) fetchPayoutMinAmounts();
  }, [step, userId]);

  const fetchAccounts = async () => {
    if (hasAccounts) return;

    setIsDataLoading(true);
    setProgress && setProgress(70);
    try {
      const res = await getApiAuthenticated<BankAccount[]>('/app/accounts');
      setAccounts(res);
    } catch (err) {
      setErrors(handleError(err as APIError));
    }
    setIsDataLoading(false);
    if (setProgress) {
      setProgress(100);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  useEffect(() => {
    if (!isTpo) {
      router.push(localizedPath('/profile'));
      return;
    }

    if (isAuthReady) fetchAccounts();
  }, [isAuthReady, userId]);

  useEffect(() => {
    if (isTpo) {
      setTabConfig([
        {
          label: t('tabOverview'),
          link: '/profile/payouts',
          step: ManagePayoutTabs.OVERVIEW,
        },
        {
          label: t('tabPayoutSchedule'),
          link: '/profile/payouts/schedule',
          step: ManagePayoutTabs.PAYOUT_SCHEDULE,
        },
        {
          label: t('tabAddBankDetails'),
          link: '/profile/payouts/add-bank-details',
          step: ManagePayoutTabs.ADD_BANK_DETAILS,
        },
      ]);
    }
  }, [userId, locale]);

  const renderStep = () => {
    switch (step) {
      case ManagePayoutTabs.PAYOUT_SCHEDULE:
        return <PayoutScheduleForm />;
      case ManagePayoutTabs.ADD_BANK_DETAILS:
        return <AddBankAccount />;
      case ManagePayoutTabs.OVERVIEW:
        return isEdit ? (
          <EditBankAccount />
        ) : (
          <Overview isDataLoading={isDataLoading} />
        );
      default:
        return <Overview isDataLoading={isDataLoading} />;
    }
  };

  return (
    <DashboardView title={t('title')} subtitle={<p>{t('description')}</p>}>
      <TabbedView step={step} tabItems={tabConfig}>
        {renderStep()}
      </TabbedView>
    </DashboardView>
  );
}
