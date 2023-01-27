import React, { useEffect, useContext, useState } from 'react';
import DashboardView from '../../common/Layout/DashboardView';
import Details from './Details';
import { useTranslation } from 'next-i18next';
import { UserPropsContext } from '../../common/Layout/UserPropsContext';
import { useRouter } from 'next/router';
import SingleColumnView from '../../common/Layout/SingleColumnView';
import { GiftFundsType } from '../../common/types/user';

const GiftFunds = () => {
  const { t, ready } = useTranslation('giftfunds');
  const router = useRouter();
  const { user } = useContext(UserPropsContext);

  useEffect(() => {
    if (
      !user.planetCash ||
      user.planetCash?.giftFunds.filter((gift) => gift.openUnits !== 0)
        .length === 0
    )
      router.push('/profile');
  }, [user]);

  const [validGiftFunds, setValidGiftFunds] = useState<GiftFundsType[] | null>(
    null
  );

  React.useEffect(() => {
    //Not displaying details for gift fund where open units = 0
    const nonZeroOpenUnitsGiftFunds = user.planetCash?.giftFunds.filter(
      (gift) => gift.openUnits !== 0
    );
    setValidGiftFunds(
      nonZeroOpenUnitsGiftFunds ? nonZeroOpenUnitsGiftFunds : null
    );
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
        <SingleColumnView>
          {validGiftFunds?.map((gift: GiftFundsType, index: number) => (
            <Details gift={gift} key={index} />
          ))}
        </SingleColumnView>
      </DashboardView>
    )
  );
};

export default GiftFunds;
