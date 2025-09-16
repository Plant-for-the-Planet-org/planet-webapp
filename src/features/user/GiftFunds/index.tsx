import type { GiftFund } from '@planet-sdk/common/build/types/user';

import { useEffect, useState } from 'react';
import DashboardView from '../../common/Layout/DashboardView';
import GiftFundDetails from './GiftFundDetails';
import { useTranslations } from 'next-intl';
import { useUserProps } from '../../common/Layout/UserPropsContext';
import SingleColumnView from '../../common/Layout/SingleColumnView';
import useLocalizedPath from '../../../hooks/useLocalizedPath';
import { useRouter } from 'next/router';

const GiftFunds = () => {
  const t = useTranslations('GiftFunds');
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  const { user } = useUserProps();

  useEffect(() => {
    if (
      !user?.planetCash ||
      user.planetCash?.giftFunds.filter((gift) => gift.openUnits !== 0)
        .length === 0
    )
      router.push(localizedPath('/profile'));
  }, [user]);

  const [validGiftFunds, setValidGiftFunds] = useState<GiftFund[] | null>(null);

  useEffect(() => {
    //Not displaying details for gift fund where open units = 0
    const nonZeroOpenUnitsGiftFunds = user?.planetCash?.giftFunds.filter(
      (gift) => gift.openUnits !== 0
    );
    setValidGiftFunds(
      nonZeroOpenUnitsGiftFunds ? nonZeroOpenUnitsGiftFunds : null
    );
  }, [user]);

  return (
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
        {validGiftFunds?.map((giftFund, index) => (
          <GiftFundDetails giftFund={giftFund} key={index} />
        ))}
      </SingleColumnView>
    </DashboardView>
  );
};

export default GiftFunds;
