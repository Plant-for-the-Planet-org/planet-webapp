import React, { ReactElement, useEffect, useCallback, useContext } from 'react';
import UserLayout from '../../../../src/features/common/Layout/UserLayout/UserLayout';
import BulkCodes from '../../../../src/features/user/BulkCodes';
import Head from 'next/head';
import i18next from '../../../../i18n';
import { BulkCodeMethods } from '../../../../src/utils/constants/bulkCodeMethods';
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
          const projectDetails = await getRequest<{
            currency: string;
            unitCost: number;
            purpose: string;
            id: string;
            name: string;
            unit: string;
          }>(`/app/paymentOptions/${query.id}`, handleError, '', {
            currency: planetCashAccount.country,
          });

          if (projectDetails) {
            const _project = {
              guid: projectDetails.id,
              slug: '',
              currency: projectDetails.currency,
              unitCost: projectDetails.unitCost,
              purpose: projectDetails.purpose,
              name: projectDetails.name,
              unit: projectDetails.unit,
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
  }, [project, bulkMethod, isReady, planetCashAccount]);

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
