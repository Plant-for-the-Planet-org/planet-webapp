import { ReactElement, useContext } from 'react';
import { styled, Grid, Button, Divider } from '@mui/material';
import i18next from '../../../../../i18n';
import { postAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import getFormatedCurrency from '../../../../utils/countryCurrency/getFormattedCurrency';
import { getDonationUrl } from '../../../../utils/getDonationUrl';
import { UserPropsContext } from '../../../common/Layout/UserPropsContext';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';

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
  isPlanetCashActive: boolean;
  account: PlanetCash.Account;
  updateAccount: (account: PlanetCash.Account) => void;
}

const AccountDetails = ({
  isPlanetCashActive,
  account,
  updateAccount,
}: AccountDetailsProps): ReactElement => {
  const { t, i18n } = useTranslation('planetcash');
  const { token } = useContext(UserPropsContext);
  const { handleError } = useContext(ErrorHandlingContext);

  const addBalanceLink = getDonationUrl('planetcash', token);

  const handleDeactivate = async () => {
    const res = await postAuthenticatedRequest(
      `/app/planetCash/${account.id}/deactivate`,
      {},
      token,
      handleError
    );
    if (res && !res['error_code']) {
      updateAccount(res);
    }
  };

  const handleActivate = async () => {
    const res = await postAuthenticatedRequest(
      `/app/planetCash/${account.id}/activate`,
      {},
      token,
      handleError
    );
    if (res) {
      if (!res['error_code']) {
        updateAccount(res);
      } else {
        switch (res['error_code']) {
          case 'active_account_exists':
            handleError({
              code: 400,
              message: t(`accountError.${res['error_code']}`),
            });
            break;
          default:
            handleError({
              code: 400,
              message: t(`accountError.default`),
            });
            break;
        }
      }
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
          <h3 className="detailTitle">{t('Account Holder')}</h3>
          <div className="detailInfo">{account.ownerName}</div>
        </Grid>
        <Grid item component={SingleDetail} xs={6} md={4}>
          <h3 className="detailTitle">{t('Donation Balance')}</h3>
          <div className="detailInfo">
            {getFormatedCurrency(
              i18n.language,
              account.currency,
              account.balance / 100
            )}
          </div>
        </Grid>
        <Grid item component={SingleDetail} xs={6} md={4}>
          <h3 className="detailTitle">{t('Donation Credit')}</h3>
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
            <Button onClick={handleDeactivate} color="warning">
              {t('deactivateAccountButton')}
            </Button>
          ) : isPlanetCashActive ? (
            <p className="helpText">{t('accountInactiveHelpText')}</p>
          ) : (
            <Button onClick={handleActivate}>
              {t('activateAccountButton')}
            </Button>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AccountDetails;
