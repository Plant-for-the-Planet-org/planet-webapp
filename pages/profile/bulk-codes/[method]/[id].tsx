import React, { ReactElement, useEffect, useCallback, useContext } from 'react';
import UserLayout from '../../../../src/features/common/Layout/UserLayout/UserLayout';
import BulkCodes from '../../../../src/features/user/BulkCodes';
import { PaymentOptions } from '../../../../src/features/user/BulkCodes/BulkCodesTypes';
import Head from 'next/head';
import i18next from '../../../../i18n';
import { BulkCodeMethods } from '../../../../src/utils/constants/bulkCodeConstants';
import { useBulkCode } from '../../../../src/features/common/Layout/BulkCodeContext';
import { ErrorHandlingContext } from '../../../../src/features/common/Layout/ErrorHandlingContext';
import { getRequest } from '../../../../src/utils/apiRequests/api';
import { useRouter } from 'next/router';

const { useTranslation } = i18next;

interface Props {}
export default function BulkCodeIssueCodesPage({}: Props): ReactElement {
  const router = useRouter();
  const { isReady, query } = useRouter();
  const { t, ready } = useTranslation('me');
  const { handleError } = useContext(ErrorHandlingContext);

  const { project, setProject, bulkMethod, setBulkMethod, planetCashAccount } =
    useBulkCode();

  const checkContext = useCallback(async () => {
    if (planetCashAccount) {
      if (!project) {
        if (isReady) {
          const paymentOptions = await getRequest<PaymentOptions>(
            `/app/paymentOptions/${query.id}`,
            handleError,
            '',
            {
              currency: planetCashAccount.country,
            }
          );

          if (paymentOptions) {
            const _project = {
              guid: paymentOptions.id,
              slug: '',
              currency: paymentOptions.currency,
              unitCost: paymentOptions.unitCost,
              purpose: paymentOptions.purpose,
              name: paymentOptions.name,
              unit: paymentOptions.unit,
              allowDonations: true,
            };
            setProject(_project);
          }
        } else {
          router.push(`/profile/bulk-codes`);
        }
      }

      if (!bulkMethod) {
        if (isReady) {
          const _bulkMethod = query.method;
          if (
            _bulkMethod === BulkCodeMethods.GENERIC ||
            _bulkMethod === BulkCodeMethods.IMPORT
          ) {
            setBulkMethod(_bulkMethod);
          } else {
            router.push(`/profile/bulk-codes`);
          }
        }
      }
    }
  }, [isReady, planetCashAccount]);

  useEffect(() => {
    checkContext();
  }, [checkContext]);

  return (
    <UserLayout>
      <Head>
        <title>{ready ? t('bulkCodesTitleStep3') : ''}</title>
      </Head>
      <BulkCodes step={2} />
    </UserLayout>
  );
}
