import { ReactElement } from 'react';
import { styled, Grid, Button, Divider } from '@mui/material';
import i18next from '../../../../../i18n';

const { useTranslation } = i18next;

const AccountDetailsGrid = styled('article')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: 24,
  gap: 16,
  borderRadius: 9,
  width: '100%',
  boxShadow: theme.shadows[1],
  /* '&.accountDetails--inactive': {
    opacity: '80%',
    backgroundColor: theme.palette.grey[200],
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
  }, */
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
  /* '& .helpText': {
    fontStyle: 'italic',
  }, */
}));

const SingleDetail = styled('div')(({ theme }) => ({
  '& .detailTitle': {
    fontWeight: theme.typography.fontWeightBold,
    marginBottom: 9,
  },
}));

interface BankAccountDetailsProps {
  account: Payouts.BankAccount;
}

const BankAccountDetails = ({
  account,
}: BankAccountDetailsProps): ReactElement => {
  const { t } = useTranslation('managePayouts');

  const handleEdit = () => {
    window.alert('Editing account');
  };

  const renderAccountTitle = () => {
    const { currency } = account;
    if (!currency) {
      return t('defaultCurrency');
    } else {
      return t('accountTitleText', { currency });
    }
  };

  return (
    <Grid
      container
      className="accountDetails"
      component={AccountDetailsGrid}
      direction="column"
    >
      <Grid container item component="header" className="accountHeader">
        <Grid item component="h2" className="accountTitle" xs={12}>
          {renderAccountTitle()}
        </Grid>
      </Grid>
      <Grid item component={Divider} />
      <Grid container item className="accountDetails" columnSpacing={2}>
        <Grid item component={SingleDetail} xs={12} md={6}>
          <h3 className="detailTitle">{t('labels.bankName')}</h3>
          <div className="detailInfo">{account.bankName}</div>
        </Grid>
        <Grid item component={SingleDetail} xs={12} md={6}>
          <h3 className="detailTitle">{t('labels.bankAddress')}</h3>
          <div className="detailInfo">{account.bankAddress}</div>
        </Grid>
        <Grid item component={SingleDetail} xs={12} md={6}>
          <h3 className="detailTitle">{t('labels.holderName')}</h3>
          <div className="detailInfo">{account.holderName}</div>
        </Grid>
        <Grid item component={SingleDetail} xs={12} md={6}>
          <h3 className="detailTitle">{t('labels.holderAddress')}</h3>
          <div className="detailInfo">{account.holderAddress}</div>
        </Grid>
        <Grid item component={SingleDetail} xs={12} md={6}>
          <h3 className="detailTitle">{t('labels.accountNumber')}</h3>
          <div className="detailInfo">{account.accountNumber}</div>
        </Grid>
        <Grid item component={SingleDetail} xs={12} md={6}>
          <h3 className="detailTitle">{t('labels.bic')}</h3>
          <div className="detailInfo">{account.bic}</div>
        </Grid>
        <Grid item component={SingleDetail} xs={12} md={6}>
          <h3 className="detailTitle">{t('labels.branchCode')}</h3>
          <div className="detailInfo">{account.branchCode || '-'}</div>
        </Grid>
        <Grid item component={SingleDetail} xs={12} md={6}>
          <h3 className="detailTitle">{t('labels.routingNumber')}</h3>
          <div className="detailInfo">{account.routingNumber || '-'}</div>
        </Grid>
        <Grid item component={SingleDetail} xs={12}>
          <h3 className="detailTitle">{t('labels.remarks')}</h3>
          <div className="detailInfo">{account.remarks || '-'}</div>
        </Grid>
        <Grid item xs={12}>
          <Button onClick={handleEdit}>{t('editAccountButton')}</Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default BankAccountDetails;
