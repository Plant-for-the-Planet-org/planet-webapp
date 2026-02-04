import type { ReactElement } from 'react';
import type { GiftFund } from '@planet-sdk/common';

import { useTranslations } from 'next-intl';
import { Divider, Grid, styled } from '@mui/material';
import themeProperties from '../../../theme/themeProperties';
import { useUserStore } from '../../../stores';

interface Props {
  giftFund: GiftFund;
}

const GiftFundDetails = ({ giftFund }: Props): ReactElement | null => {
  const t = useTranslations('GiftFunds');
  // store: state
  const userPlanetCash = useUserStore((state) => state.userProfile?.planetCash);
  if (!userPlanetCash) return null;

  const StyledContainer = styled('article')(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    padding: 24,
    borderRadius: 9,
    boxShadow: theme.shadows[1],
    marginBottom: 24,
    fontSize: themeProperties.fontSizes.fontSmall,
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

  return (
    <Grid
      container
      className="giftFunds_container"
      direction="column"
      component={StyledContainer}
    >
      <Grid container item className="container_heading">
        {userPlanetCash.country}/{userPlanetCash.currency} {t('title')}
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
  );
};

export default GiftFundDetails;
