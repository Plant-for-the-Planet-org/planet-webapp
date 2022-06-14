import React, { ReactElement } from 'react';
import i18next from '../../../../../i18n';

import DashboardView from '../../../common/Layout/DashboardView';
import SingleColumnView from './SingleColumnView';

const { useTranslation } = i18next;

export default function DonationLink(): ReactElement | null {
  const { t, ready } = useTranslation(['donationLink']);
  return ready ? (
    <DashboardView
      title={t('donationLink:donationLinkTitle')}
      subtitle={<p>{t('donationLink:donationLinkDescription')}</p>}
    >
      <SingleColumnView>Donation Link Form comes here</SingleColumnView>
    </DashboardView>
  ) : null;
}
