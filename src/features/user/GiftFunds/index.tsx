import React from 'react';
import DashboardView from '../../common/Layout/DashboardView';
import Details from './Details';
import i18next from '../../../../i18n';

const { useTranslation } = i18next;
const GiftFunds = () => {
  const { t, ready } = useTranslation('giftfunds');
  return (
    ready && (
      <DashboardView
        title={t('title')}
        subtitle={
          <p>
            {t('description1')}
            <br />
            {t('description2')}
          </p>
        }
      >
        <Details />
      </DashboardView>
    )
  );
};

export default GiftFunds;
