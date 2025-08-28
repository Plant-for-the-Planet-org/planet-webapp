import type { ReactElement } from 'react';
import { useState, useEffect, useContext } from 'react';
import type { TabItem } from '../../common/Layout/TabbedView/TabbedViewTypes';
import type { APIError } from '@planet-sdk/common';
import type { BankAccount, PayoutMinAmounts } from '../../common/types/payouts';
import { useLocale, useTranslations } from 'next-intl';
import DashboardView from '../../common/Layout/DashboardView';
import TabbedView from '../../common/Layout/TabbedView';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import { useUserProps } from '../../common/Layout/UserPropsContext';
import { usePayouts } from '../../common/Layout/PayoutsContext';
import PayoutScheduleForm from './screens/PayoutScheduleForm';
import Overview from './screens/Overview';
import EditBankAccount from './screens/EditBankAccount';
import AddBankAccount from './screens/AddBankAccount';
import { useRouter } from 'next/router';
import { handleError } from '@planet-sdk/common';
import { useApi } from '../../../hooks/useApi';
import useLocalizedPath from '../../../hooks/useLocalizedPath';

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
  const { setErrors } = useContext(ErrorHandlingContext);
  const { token, contextLoaded, user } = useUserProps();
  const { accounts, setAccounts, payoutMinAmounts, setPayoutMinAmounts } =
    usePayouts();
  const { getApi, getApiAuthenticated } = useApi();
  const [tabConfig, setTabConfig] = useState<TabItem[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const fetchPayoutMinAmounts = async () => {
    if (!payoutMinAmounts) {
      try {
        const res = await getApi<PayoutMinAmounts>('/app/payoutMinAmounts');
        setPayoutMinAmounts(res);
      } catch (err) {
        setErrors(handleError(err as APIError));
      }
    }
  };

  useEffect(() => {
    if (!payoutMinAmounts && user?.type === 'tpo') fetchPayoutMinAmounts();
  }, [step, user]);

  const fetchAccounts = async () => {
    if (!accounts) {
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
    }
  };

  useEffect(() => {
    if (user?.type === 'tpo') {
      if (contextLoaded && token) fetchAccounts();
    } else {
      router.push(localizedPath('/profile'));
    }
  }, [contextLoaded, token, user]);

  useEffect(() => {
    if (user && user.type === 'tpo') {
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
  }, [user, locale]);

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
