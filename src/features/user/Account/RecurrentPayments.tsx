import React from 'react';
import DashboardView from '../../common/Layout/DashboardView';
import Recurrency from './Recurrency';
import { Subscription } from '../../common/types/payments';
import { useTranslations } from 'next-intl';

interface Props {
  isDataLoading: boolean;
  recurrencies?: Subscription[];
  fetchRecurrentDonations: (next?: boolean) => void;
}

export default function RecurrentPayments(RecurrencyProps: Props) {
  const t = useTranslations('Me');
  return (
    <DashboardView title={t('payments')} subtitle={t('donationsSubTitle')}>
      <Recurrency {...RecurrencyProps} />
    </DashboardView>
  );
}
