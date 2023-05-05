import React, { ReactElement } from 'react';
import { useTranslation } from 'next-i18next';
import { styled } from '@mui/material';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import { getDonationUrl } from '../../../../utils/getDonationUrl';

const AddBalanceLink = styled('span')(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 600,
  cursor: 'pointer',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const ErrorMessage = styled('span')(({ theme }) => ({
  color: theme.palette.error.main,
}));

const BulkCodesError = (): ReactElement | null => {
  const { t } = useTranslation(['bulkCodes']);
  const { user, token } = useUserProps();

  const GetDisableBulkCodesReason = () => {
    // TODO - Translations
    if (user) {
      if (!user.planetCash) {
        return <ErrorMessage>{t('planetCashDisabled')}</ErrorMessage>;
      } else if (Object.keys(user.planetCash).length > 0) {
        if (user.planetCash.balance + user.planetCash.creditLimit <= 0) {
          const donationUrl = getDonationUrl('planetcash', token);
          return (
            <div>
              <ErrorMessage>{t('insufficientPCashBalance')}</ErrorMessage>
              &nbsp;
              <a href={donationUrl}>
                <AddBalanceLink>{t('addBalanceGeneric')}</AddBalanceLink>
              </a>
            </div>
          );
        } else return null;
      } else return null;
    } else return null;
  };

  return <GetDisableBulkCodesReason />;
};

export default BulkCodesError;
