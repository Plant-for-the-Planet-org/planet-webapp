import React, { useContext } from 'react';

import { styled } from 'mui-latest';
import { UserPropsContext } from '../../../common/Layout/UserPropsContext';

import i18next from '../../../../../i18n';
const { useTranslation } = i18next;

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

const BulkCodesError = () => {
  const { t } = useTranslation(['bulkCodes']);
  const { user } = useContext(UserPropsContext);

  const GetDisableBulkCodesReason = () => {
    // TODO - Translations
    if (user) {
      if (!user.planetCash) {
        return <ErrorMessage>{t('planetCashDisabled')}</ErrorMessage>;
      } else if (Object.keys(user.planetCash).length > 0) {
        if (user.planetCash.balance + user.planetCash.creditLimit <= 0) {
          return (
            <div>
              <ErrorMessage>{t('insufficientPCashBalance')}</ErrorMessage>
              &nbsp;
              <a
                target="_blank"
                href={`${process.env.NEXT_PUBLIC_DONATION_URL}/?to=${user.planetCash.account}&step=donate`}
                rel="noopener noreferrer"
              >
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
