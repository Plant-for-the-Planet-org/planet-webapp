import { ReactElement } from 'react';
import { styled, Grid, Button, Divider } from '@mui/material';
import getFormatedCurrency from '../../../../utils/countryCurrency/getFormattedCurrency';
import i18next from '../../../../../i18n';

const { useTranslation } = i18next;

const AccountDetailsGrid = styled('article')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: 24,
  gap: 16,
  borderRadius: 9,
  width: '100%',
  boxShadow: theme.shadows[1],
  '& .accountHeader': {
    rowGap: 16,
  },
  '& .accountHeaderLeft': {
    gap: 16,
  },
  '& .accountHeaderRight': {
    gap: 16,
    justifyContent: 'space-between',
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
  '& .test': {
    width: 'fit-content',
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

interface AccountDetailsProps {
  account: PlanetCash.Account;
}

const AccountDetails = ({ account }: AccountDetailsProps): ReactElement => {
  const { t, i18n } = useTranslation();
  return (
    <Grid
      container
      className="accountDetailsGrid"
      component={AccountDetailsGrid}
      direction="column"
    >
      <Grid container item component="header" className="accountHeader">
        <Grid container item xs={12} sm={8} className="accountHeaderLeft">
          <Grid item component="h2" className="accountTitle" xs={12}>
            {account.currency} PlanetCash Account ({account.country})
          </Grid>
          <Grid item xs={12}>
            {account.id}
          </Grid>
        </Grid>
        <Grid container item xs={12} sm={4} className="accountHeaderRight">
          <Grid item className="balance">
            {getFormatedCurrency(
              i18n.language,
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
              className="test"
            >
              Add Balance
            </Grid>
          )}
        </Grid>
      </Grid>
      <Grid item component={Divider} />
      <Grid container item className="accountDetails">
        <Grid item component={SingleDetail} xs={6} md={4}>
          <h3 className="detailTitle">Account Holder</h3>
          <div className="detailInfo">{account.ownerName}</div>
        </Grid>
        <Grid item component={SingleDetail} xs={6} md={4}>
          <h3 className="detailTitle">Donation Balance</h3>
          <div className="detailInfo">
            {getFormatedCurrency(
              i18n.language,
              account.currency,
              account.balance / 100
            )}
          </div>
        </Grid>
        <Grid item component={SingleDetail} xs={6} md={4}>
          <h3 className="detailTitle">Donation Credit</h3>
          <div className="detailInfo">
            {getFormatedCurrency(
              i18n.language,
              account.currency,
              account.creditLimit / 100
            )}
          </div>
        </Grid>
        <Grid item xs={12}>
          {account.isActive ? (
            <Button>Deactivate</Button>
          ) : (
            <p>
              <em>
                This account is inactive. To activate this account, please
                deactivate your active account first.
              </em>
            </p>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AccountDetails;
