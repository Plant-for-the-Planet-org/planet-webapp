import {
  ReactElement,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import i18next from '../../../../i18n';
import DashboardView from '../../common/Layout/DashboardView';
import TabbedView from '../../common/Layout/TabbedView';
import { TabItem } from '../../common/Layout/TabbedView/TabbedViewTypes';
import {
  getAuthenticatedRequest,
  getRequest,
} from '../../../utils/apiRequests/api';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import { UserPropsContext } from '../../common/Layout/UserPropsContext';
import { usePayouts } from '../../common/Layout/PayoutsContext';
import PayoutScheduleForm from './screens/PayoutScheduleForm';
import Overview from './screens/Overview';
import EditBankAccount from './screens/EditBankAccount';
import AddBankAccount from './screens/AddBankAccount';
import { useRouter } from 'next/router';

const { useTranslation } = i18next;

export enum ManagePayoutSteps {
  OVERVIEW = 0,
  PAYOUT_SCHEDULE = 1,
  ADD_BANK_DETAILS = 2,
}

interface ManagePayoutsProps {
  step: number;
  setProgress?: (progress: number) => void;
  isEdit?: boolean;
}

export default function ManagePayouts({
  step,
  setProgress,
  isEdit,
}: ManagePayoutsProps): ReactElement | null {
  const { t, ready } = useTranslation('managePayouts');
  const router = useRouter();
  const { handleError } = useContext(ErrorHandlingContext);
  const { token, contextLoaded, user } = useContext(UserPropsContext);
  const { accounts, setAccounts, payoutMinAmounts, setPayoutMinAmounts } =
    usePayouts();
  const [tabConfig, setTabConfig] = useState<TabItem[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const fetchPayoutMinAmounts = useCallback(async () => {
    if (!payoutMinAmounts) {
      try {
        const res = await getRequest<Payouts.PayoutMinAmounts>(
          '/app/payoutMinAmounts',
          handleError
        );
        if (res && !res['error_code']) {
          setPayoutMinAmounts(res);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }, []);

  useEffect(() => {
    if (!payoutMinAmounts && user.type === 'tpo') fetchPayoutMinAmounts();
  }, [step, user]);

  const fetchAccounts = useCallback(async () => {
    if (!accounts) {
      setIsDataLoading(true);
      setProgress && setProgress(70);
      try {
        const res = await getAuthenticatedRequest<Payouts.BankAccount[]>(
          `/app/accounts`,
          token,
          {},
          handleError
        );
        if (res && res.length > 0) {
          setAccounts(res);
        }
      } catch (err) {
        console.log(err);
      }
      setIsDataLoading(false);
      if (setProgress) {
        setProgress(100);
        setTimeout(() => setProgress(0), 1000);
      }
    }
  }, []);

  useEffect(() => {
    if (user.type === 'tpo') {
      if (contextLoaded && token) fetchAccounts();
    } else {
      router.push('/profile');
    }
  }, [contextLoaded, token, user]);

  useEffect(() => {
    if (ready && user.type === 'tpo') {
      setTabConfig([
        {
          label: t('tabOverview'),
          link: '/profile/payouts',
          hasList: !isEdit,
        },
        {
          label: t('tabPayoutSchedule'),
          link: '/profile/payouts/schedule',
        },
        {
          label: t('tabAddBankDetails'),
          link: '/profile/payouts/add-bank-details',
        },
      ]);
    }
  }, [ready, user]);

  const renderStep = () => {
    switch (step) {
      case ManagePayoutSteps.PAYOUT_SCHEDULE:
        return <PayoutScheduleForm />;
      case ManagePayoutSteps.ADD_BANK_DETAILS:
        return <AddBankAccount />;
      case ManagePayoutSteps.OVERVIEW:
        return isEdit ? (
          <EditBankAccount />
        ) : (
          <Overview isDataLoading={isDataLoading} />
        );
      default:
        return <Overview isDataLoading={isDataLoading} />;
    }
  };

  return ready && tabConfig.length > 0 ? (
    <DashboardView title={t('title')} subtitle={<p>{t('description')}</p>}>
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
