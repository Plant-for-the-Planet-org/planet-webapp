import React, { useEffect, useContext } from 'react';
import DashboardView from '../../common/Layout/DashboardView';
import Details from './Details';
import i18next from '../../../../i18n';
import { UserPropsContext } from '../../common/Layout/UserPropsContext';
import { useRouter } from 'next/router';

const { useTranslation } = i18next;
const GiftFunds = () => {
  const { t, ready } = useTranslation('giftfunds');
  const router = useRouter();
  const { user } = useContext(UserPropsContext);

  useEffect(() => {
    if (
      !user.planetCash ||
      user.planetCash?.giftFunds.filter((gift) => gift.openUnits === 0)
        .length !== 0
    )
      router.push('/profile');
  }, [user]);
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
