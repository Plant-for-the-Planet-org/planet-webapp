import type { ReactElement } from 'react';

import { useTranslations } from 'next-intl';
import { styled } from '@mui/material';
import { getDonationUrl } from '../../../../utils/getDonationUrl';
import { useTenant } from '../../../common/Layout/TenantContext';
import { useAuthStore, useUserStore } from '../../../../stores';

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
  const t = useTranslations('BulkCodes');
  const { tenantConfig } = useTenant();
  //store: state
  const token = useAuthStore((state) => state.token);
  const userProfile = useUserStore((state) => state.userProfile);

  const GetDisableBulkCodesReason = () => {
    if (!userProfile) return null;
    const planetCash = userProfile.planetCash;

    if (!planetCash) {
      return <ErrorMessage>{t('planetCashDisabled')}</ErrorMessage>;
    }

    if (planetCash.balance + planetCash.creditLimit <= 0) {
      const donationUrl = getDonationUrl(tenantConfig.id, 'planetcash', token);

      return (
        <div>
          <ErrorMessage>{t('insufficientPCashBalance')}</ErrorMessage>
          &nbsp;
          <a href={donationUrl}>
            <AddBalanceLink>{t('addBalanceGeneric')}</AddBalanceLink>
          </a>
        </div>
      );
    }

    return null;
  };

  return <GetDisableBulkCodesReason />;
};

export default BulkCodesError;
