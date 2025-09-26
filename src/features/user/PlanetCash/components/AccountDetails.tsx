import type { ReactElement } from 'react';
import type { PlanetCashAccount } from '../../../common/types/planetcash';

import { styled, Grid, Button, Divider } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';
import getFormattedCurrency from '../../../../utils/countryCurrency/getFormattedCurrency';
import { getDonationUrl } from '../../../../utils/getDonationUrl';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import { useTenant } from '../../../common/Layout/TenantContext';
import themeProperties from '../../../../theme/themeProperties';

const AccountDetailsGrid = styled('article')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: 24,
  gap: 16,
  borderRadius: 9,
  width: '100%',
  boxShadow: theme.shadows[1],
  fontSize: themeProperties.fontSizes.fontSmall,
  '&.accountDetails--inactive': {
    opacity: '80%',
    backgroundColor:
      themeProperties.designSystem.colors.mediumGreyTransparent30,
  },
  '& .accountHeader': {
    rowGap: 16,
  },
  '& .accountHeaderLeft': {
    gap: 16,
  },
  '& .accountHeaderRight': {
    gap: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'column',
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
  },
  '& .balance': {
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightBold,
    textAlign: 'right',
  },
  '& .accountTitle': {
    fontWeight: theme.typography.fontWeightBold,
  },
  '& .accountDetails': {
    rowGap: 20,
  },
  '& .helpText': {
    fontStyle: 'italic',
  },
}));

const SingleDetail = styled('div')(({ theme }) => ({
  '& .detailTitle': {
    fontWeight: theme.typography.fontWeightBold,
    marginBottom: 9,
  },
}));

interface AccountDetailsProps {
  account: PlanetCashAccount;
}

const AccountDetails = ({ account }: AccountDetailsProps): ReactElement => {
  const t = useTranslations('PlanetCash');
  const locale = useLocale();
  const { token } = useUserProps();
  const { tenantConfig } = useTenant();

  const addBalanceLink = getDonationUrl(tenantConfig.id, 'planetcash', token);

  return (
    <Grid
      container
      className={`accountDetails ${
        !account.isActive ? 'accountDetails--inactive' : ''
      }`}
      component={AccountDetailsGrid}
      direction="column"
    >
      <Grid container item component="header" className="accountHeader">
        <Grid container item xs={12} sm={8} className="accountHeaderLeft">
          <Grid item component="h2" className="accountTitle" xs={12}>
            {t('accountTitleText', {
              currency: account.currency,
              country: account.country,
            })}
          </Grid>
          <Grid item xs={12}>
            {account.id}
          </Grid>
        </Grid>
        <Grid container item xs={12} sm={4} className="accountHeaderRight">
          <Grid item className="balance">
            {getFormattedCurrency(
              locale,
              account.currency,
              (account.balance + account.creditLimit) / 100
            )}
          </Grid>
          {account.isActive && (
            <Grid
              item
              component={Button}
              variant="contained"
              size="small"
              href={addBalanceLink}
            >
              {t('addBalanceButton')}
            </Grid>
          )}
        </Grid>
      </Grid>
      <Grid item component={Divider} />
      <Grid container item className="accountDetails">
        <Grid item component={SingleDetail} xs={6} md={4}>
          <h3 className="detailTitle">{t('labelAccountHolder')}</h3>
          <div className="detailInfo">{account.ownerName}</div>
        </Grid>
        <Grid item component={SingleDetail} xs={6} md={4}>
          <h3 className="detailTitle">{t('labelBalance')}</h3>
          <div className="detailInfo">
            {getFormattedCurrency(
              locale,
              account.currency,
              account.balance / 100
            )}
          </div>
        </Grid>
        {account.creditLimit > 0 && (
          <Grid item component={SingleDetail} xs={6} md={4}>
            <h3 className="detailTitle">{t('labelCreditLimit')}</h3>
            <div className="detailInfo">
              {getFormattedCurrency(
                locale,
                account.currency,
                account.creditLimit / 100
              )}
            </div>
          </Grid>
        )}
        {!account.isActive && (
          <Grid item xs={12}>
            <p className="helpText">
              {t.rich('accountInactiveHelpText', {
                supportLink: (chunk) => (
                  <a
                    className="planet-links"
                    href="mailto:support@plant-for-the-planet.org"
                  >
                    {chunk}
                  </a>
                ),
              })}
            </p>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default AccountDetails;
