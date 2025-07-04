import type { ReactElement } from 'react';
import type { BankAccount } from '../../../common/types/payouts';

import { styled, Grid, Button, Divider } from '@mui/material';
import getFormatedCurrency from '../../../../utils/countryCurrency/getFormattedCurrency';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import themeProperties from '../../../../theme/themeProperties';

// TODOO - See if something can be made common between accounts of Manage Accounts and Planet Cash
const AccountDetailsGrid = styled('article')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: 24,
  gap: 16,
  borderRadius: 9,
  width: '100%',
  boxShadow: theme.shadows[1],
  fontSize: themeProperties.fontSizes.fontSmall,
  '& .accountHeader': {
    justifyContent: 'space-between',
    rowGap: 16,
  },
  '& .accountHeaderRight': {
    justifyContent: 'flex-end',
  },
  '& .accountTitle': {
    fontWeight: theme.typography.fontWeightBold,
  },
  '& .accountDetails': {
    rowGap: 20,
  },
}));

const SingleDetail = styled('div')(({ theme }) => ({
  '& .detailTitle': {
    fontWeight: theme.typography.fontWeightBold,
    marginBottom: 9,
  },
}));

interface BankAccountDetailsProps {
  account: BankAccount;
}

const BankAccountDetails = ({
  account,
}: BankAccountDetailsProps): ReactElement => {
  const tCountry = useTranslations('Country');
  const tManagePayouts = useTranslations('ManagePayouts');
  const locale = useLocale();

  const renderAccountTitle = () => {
    const { currency } = account;
    if (!currency) {
      return tManagePayouts('defaultCurrency');
    } else {
      return tManagePayouts('accountTitleText', { currency });
    }
  };

  return (
    <Grid
      container
      className="BankAccountDetails"
      component={AccountDetailsGrid}
      direction="column"
    >
      <Grid container item component="header" className="accountHeader">
        <Grid container item xs={6} sm={8} className="accountHeaderLeft">
          <Grid item component="h2" className="accountTitle">
            {renderAccountTitle()}
          </Grid>
        </Grid>
        {account.currency !== null && account.payoutMinAmount !== null && (
          <Grid container item xs={6} sm={4} className="accountHeaderRight">
            {tManagePayouts('minPayoutText', {
              amount: getFormatedCurrency(
                locale,
                account.currency,
                account.payoutMinAmount,
                true
              ),
            })}
          </Grid>
        )}
      </Grid>
      <Grid item component={Divider} />
      <Grid container item className="accountDetails" columnSpacing={2}>
        <Grid item component={SingleDetail} xs={12} md={6}>
          <h3 className="detailTitle">{tManagePayouts('labels.bankName')}</h3>
          <div className="detailInfo">{account.bankName}</div>
        </Grid>
        <Grid item component={SingleDetail} xs={12} md={6}>
          <h3 className="detailTitle">
            {tManagePayouts('labels.bankCountry')}
          </h3>
          <div className="detailInfo">
            {tCountry(account.bankCountry.toLowerCase())}
          </div>
        </Grid>
        <Grid item component={SingleDetail} xs={12}>
          <h3 className="detailTitle">
            {tManagePayouts('labels.bankAddress')}
          </h3>
          <div className="detailInfo">{account.bankAddress}</div>
        </Grid>
        <Grid item component={SingleDetail} xs={12} md={6}>
          <h3 className="detailTitle">{tManagePayouts('labels.holderName')}</h3>
          <div className="detailInfo">{account.holderName}</div>
        </Grid>
        <Grid item component={SingleDetail} xs={12} md={6}>
          <h3 className="detailTitle">
            {tManagePayouts('labels.holderAddress')}
          </h3>
          <div className="detailInfo">{account.holderAddress}</div>
        </Grid>
        <Grid item component={SingleDetail} xs={12} md={6}>
          <h3 className="detailTitle">
            {tManagePayouts('labels.accountNumber')}
          </h3>
          <div className="detailInfo">{account.accountNumber}</div>
        </Grid>
        <Grid item component={SingleDetail} xs={12} md={6}>
          <h3 className="detailTitle">{tManagePayouts('labels.bic')}</h3>
          <div className="detailInfo">{account.bic}</div>
        </Grid>
        <Grid item component={SingleDetail} xs={12} md={6}>
          <h3 className="detailTitle">{tManagePayouts('labels.branchCode')}</h3>
          <div className="detailInfo">{account.branchCode || '-'}</div>
        </Grid>
        <Grid item component={SingleDetail} xs={12} md={6}>
          <h3 className="detailTitle">
            {tManagePayouts('labels.routingNumber')}
          </h3>
          <div className="detailInfo">{account.routingNumber || '-'}</div>
        </Grid>
        <Grid item component={SingleDetail} xs={12}>
          <h3 className="detailTitle">{tManagePayouts('labels.remarks')}</h3>
          <div className="detailInfo">{account.remarks || '-'}</div>
        </Grid>
        <Grid item xs={12}>
          <Link href={`/profile/payouts/edit-bank-details/${account.id}`}>
            <Button>{tManagePayouts('editAccountButton')}</Button>
          </Link>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default BankAccountDetails;
