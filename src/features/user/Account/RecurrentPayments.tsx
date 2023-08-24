import React from 'react';
import DashboardView from '../../common/Layout/DashboardView';
import Recurrency from './Recurrency';
import { Subscription } from '../../common/types/payments';
import { useTranslation } from 'next-i18next';

interface Props {
  isDataLoading: boolean;
  recurrencies?: Subscription[];
  fetchRecurrentDonations: (next?: boolean) => void;
}

export default function RecurrentPayments(RecurrencyProps: Props) {
  const { t } = useTranslation(['me']);
  return (
    <DashboardView
      title={t('me:payments')}
      subtitle={t('me:donationsSubTitle')}
    >
      <Recurrency {...RecurrencyProps} />
    </DashboardView>
  );
}
