import React, { ReactElement, useEffect, useCallback, useContext } from 'react';
import UserLayout from '../../../../src/features/common/Layout/UserLayout/UserLayout';
import BulkCodes from '../../../../src/features/user/BulkCodes';
import Head from 'next/head';
import i18next from '../../../../i18n';
import { useBulkCode } from '../../../../src/features/common/Layout/BulkCodeContext';
import { ErrorHandlingContext } from '../../../../src/features/common/Layout/ErrorHandlingContext';
import { getRequest } from '../../../../src/utils/apiRequests/api';
import { useRouter } from 'next/router';

const { useTranslation } = i18next;

interface Props {}
export default function BulkCodeIssueCodesPage({}: Props): ReactElement {
  const { isReady, query } = useRouter();
  const { t } = useTranslation('me');
  const { handleError } = useContext(ErrorHandlingContext);

  const { project, setProject, planetCashAccount } = useBulkCode();

  const fetchProject = useCallback(async () => {
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
        }
      }
    }
  }, [project, isReady, planetCashAccount]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  return (
    <UserLayout>
      <Head>
        <title>{t('bulkCodesTitleStep3')}</title>
      </Head>
      <BulkCodes step={2} />
    </UserLayout>
  );
}
