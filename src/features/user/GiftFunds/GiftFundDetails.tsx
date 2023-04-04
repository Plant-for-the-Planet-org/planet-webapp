import React, { useContext, ReactElement } from 'react';
import { UserPropsContext } from '../../common/Layout/UserPropsContext';
import { useTranslation } from 'next-i18next';
import { Divider, Grid, styled } from '@mui/material';
import { GiftFundsType } from '../../common/types/user';

interface Props {
  giftFund: GiftFundsType;
}

const GiftFundDetails = ({ giftFund }: Props): ReactElement | null => {
  const { user } = useContext(UserPropsContext);
  const { t, ready } = useTranslation('giftfunds');

  const StyledContainer = styled('article')(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    padding: 24,
    borderRadius: 9,
    boxShadow: theme.shadows[1],
    marginBottom: 24,
    fontSize: '0.875rem',
    gap: 16,
    '& .container_heading': {
      fontWeight: theme.typography.fontWeightBold,
    },
    '& .container_details': {
      gap: 16,
    },
  }));

  const SingleDetail = styled('div')(({ theme }) => ({
    flex: 1,
    '& .detailTitle': {
      fontWeight: theme.typography.fontWeightBold,
      marginBottom: 9,
    },
  }));

  if (ready && user.planetCash) {
    return (
      <>
        <Grid
          container
          className="giftFunds_container"
          direction="column"
          component={StyledContainer}
        >
          <Grid container item className="container_heading">
            {user.planetCash?.country}/{user.planetCash?.currency} {t('title')}
          </Grid>
          <Grid item component={Divider} />
          <Grid container item className="container_details" direction="row">
            <Grid item component={SingleDetail}>
              <b className="detailTitle">{t('project')}</b>
              <p className="detailInfo">{giftFund.project}</p>
            </Grid>

            <Grid item component={SingleDetail}>
              <b className="detailTitle">{t('units')}</b>
              <p className="detailInfo">
                {Number(giftFund.openUnits / 100).toFixed(2)}
              </p>
            </Grid>
          </Grid>
        </Grid>
      </>
    );
  }

  return null;
};

export default GiftFundDetails;
