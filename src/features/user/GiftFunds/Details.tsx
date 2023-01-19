import React, { useContext, ReactElement, useState } from 'react';
import { UserPropsContext } from '../../common/Layout/UserPropsContext';
import styles from './GiftFunds.module.scss';
import { useTranslation } from 'next-i18next';
import { GiftFunds } from '../../common/types/user';
import { styled } from '@mui/material';

const Details = (): ReactElement | null => {
  const { user } = useContext(UserPropsContext);
  const { t, ready } = useTranslation('giftfunds');
  const [validGiftFunds, setValidGiftFunds] = useState<GiftFunds[] | null>(
    null
  );

  React.useEffect(() => {
    const nonZeroOpenUnitsGiftFunds = user.planetCash?.giftFunds.filter(
      (gift) => gift.openUnits !== 0
    );
    setValidGiftFunds(
      nonZeroOpenUnitsGiftFunds ? nonZeroOpenUnitsGiftFunds : null
    );
  }, [user]);

  const StyledContainer = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    padding: 34,
    borderRadius: 9,
    boxShadow: `0px 2px 1px -1px rgb(0 0 0 / 20%),
    0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)`,
    marginBottom: 24,
    '& .container_heading': {
      paddingBottom: 16,
    },
    '& .container_details': {
      display: 'flex',
      marginTop: 24,
      flexWrap: 'wrap',
      gap: 15,

      div: {
        flex: 1,
      },
    },
    hr: {
      border: '1px solid #DDDBDA',
    },
  }));

  if (ready && user.planetCash) {
    return (
      <>
        {validGiftFunds?.map((gift: GiftFunds, index: number) => (
          //Not displaying details for gift fund where open units = 0
          <StyledContainer className={styles.container} key={index}>
            <div className="container_heading">
              <b>
                {user.planetCash?.country}/{user.planetCash?.currency}{' '}
                {t('title')}
              </b>
            </div>
            <hr />
            <div className="container_details">
              <div className={styles.project}>
                <b>{t('project')}</b>
                <p>{gift.project}</p>
              </div>

              <div className={styles.unit}>
                <b>{t('units')}</b>
                <p>{Number(gift.openUnits / 100).toFixed(2)}</p>
              </div>
            </div>
          </StyledContainer>
        ))}
      </>
    );
  }

  return null;
};

export default Details;
