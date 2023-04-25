import React, { ReactElement, useEffect, useCallback, useContext } from 'react';
import UserLayout from '../../../../src/features/common/Layout/UserLayout/UserLayout';
import BulkCodes, {
  BulkCodeSteps,
} from '../../../../src/features/user/BulkCodes';
import { PaymentOptions } from '../../../../src/features/user/BulkCodes/BulkCodesTypes';
import Head from 'next/head';
import { BulkCodeMethods } from '../../../../src/utils/constants/bulkCodeConstants';
import { useBulkCode } from '../../../../src/features/common/Layout/BulkCodeContext';
import { ErrorHandlingContext } from '../../../../src/features/common/Layout/ErrorHandlingContext';
import { getRequest } from '../../../../src/utils/apiRequests/api';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { GetStaticPaths } from 'next';
import { handleError, APIError } from '@planet-sdk/common';

export default function BulkCodeIssueCodesPage(): ReactElement {
  const router = useRouter();
  const { isReady, query } = useRouter();
  const { t, ready } = useTranslation('me');
  const { redirect, setErrors } = useContext(ErrorHandlingContext);

  const { project, setProject, bulkMethod, setBulkMethod, planetCashAccount } =
    useBulkCode();

  // Checks context and sets project, bulk method if not already set within context
  const checkContext = useCallback(async () => {
    if (planetCashAccount) {
      if (!project) {
        if (isReady) {
          try {
            const paymentOptions = await getRequest<PaymentOptions>(
              `/app/paymentOptions/${query.id}`,
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
          } catch (err) {
            setErrors(handleError(err as APIError));
            redirect('/');
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
      <BulkCodes step={BulkCodeSteps.ISSUE_CODES} />
    </UserLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(
        locale,
        [
          'bulkCodes',
          'common',
          'country',
          'donate',
          'donationLink',
          'editProfile',
          'giftfunds',
          'leaderboard',
          'managePayouts',
          'manageProjects',
          'maps',
          'me',
          'planet',
          'planetcash',
          'redeem',
          'registerTrees',
          'tenants',
          'treemapper',
        ],
        null,
        ['en', 'de', 'fr', 'es', 'it', 'pt-BR', 'cs']
      )),
    },
  };
}
