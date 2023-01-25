import React, { useContext, ReactElement, useState } from 'react';
import { UserPropsContext } from '../../common/Layout/UserPropsContext';
import { useTranslation } from 'next-i18next';
import { styled } from '@mui/material';
import { GiftFundsType } from '../../common/types/user';

interface Props {
  validGiftFunds: GiftFundsType[] | null;
}

const Details = ({ validGiftFunds }: Props): ReactElement | null => {
  const { user } = useContext(UserPropsContext);
  const { t, ready } = useTranslation('giftfunds');

  const StyledContainer = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    padding: 24,
    borderRadius: 9,
    boxShadow: theme.shadows[1],
    marginBottom: 24,
    '& .container_heading': {
      paddingBottom: 16,
    },
    '& .container_details': {
      display: 'flex',
      marginTop: 24,
      flexWrap: 'wrap',
      gap: 16,

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
        {validGiftFunds?.map((gift: GiftFundsType, index: number) => (
          //Not displaying details for gift fund where open units = 0
          <StyledContainer className="giftFunds_container" key={index}>
            <div className="container_heading">
              <b>
                {user.planetCash?.country}/{user.planetCash?.currency}{' '}
                {t('title')}
              </b>
            </div>
            <hr />
            <div className="container_details">
              <div className="project">
                <b>{t('project')}</b>
                <p>{gift.project}</p>
              </div>

              <div className="unit">
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
