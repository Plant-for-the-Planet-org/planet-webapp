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
  const { handleError } = useContext(ErrorHandlingContext);
  const { token, contextLoaded } = useContext(UserPropsContext);
  const { accounts, setAccounts, payoutMinAmounts, setPayoutMinAmounts } =
    usePayouts();
  const [tabConfig, setTabConfig] = useState<TabItem[]>([]);

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
    if (step === ManagePayoutSteps.ADD_BANK_DETAILS) fetchPayoutMinAmounts();
  }, [step]);

  const fetchAccounts = useCallback(async () => {
    if (!accounts) {
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
    }
  }, []);

  useEffect(() => {
    if (contextLoaded && token) fetchAccounts();
  }, [contextLoaded, token]);

  useEffect(() => {
    if (ready) {
      setTabConfig([
        {
          label: t('tabOverview'),
          link: '/profile/payouts',
          hasList: true,
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
  }, [ready]);

  const renderStep = () => {
    switch (step) {
      case ManagePayoutSteps.PAYOUT_SCHEDULE:
        return <PayoutScheduleForm />;
      case ManagePayoutSteps.ADD_BANK_DETAILS:
        return <BankDetailsForm payoutMinAmounts={payoutMinAmounts} />;
      case ManagePayoutSteps.OVERVIEW:
      default:
        return <Overview isDataLoading={false} />;
    }
  };

  return ready ? (
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
