import React, { ReactElement, useEffect, useCallback, useContext } from 'react';
import UserLayout from '../../../../../../src/features/common/Layout/UserLayout/UserLayout';
import BulkCodes, {
  BulkCodeSteps,
} from '../../../../../../src/features/user/BulkCodes';
import { PaymentOptions } from '../../../../../../src/features/user/BulkCodes/BulkCodesTypes';
import Head from 'next/head';
import { BulkCodeMethods } from '../../../../../../src/utils/constants/bulkCodeConstants';
import { useBulkCode } from '../../../../../../src/features/common/Layout/BulkCodeContext';
import { ErrorHandlingContext } from '../../../../../../src/features/common/Layout/ErrorHandlingContext';
import { getRequest } from '../../../../../../src/utils/apiRequests/api';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { handleError, APIError } from '@planet-sdk/common';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../../src/utils/multiTenancy/helpers';
import { v4 } from 'uuid';
import { Tenant } from '@planet-sdk/common/build/types/tenant';
import { useTenant } from '../../../../../../src/features/common/Layout/TenantContext';
import {
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import { defaultTenant } from '../../../../../../tenant.config';

interface Props {
  pageProps: {
    tenantConfig: Tenant;
  };
}

export default function BulkCodeIssueCodesPage({
  pageProps,
}: Props): ReactElement {
  const router = useRouter();
  const { isReady, query } = useRouter();
  const { t, ready } = useTranslation('me');
  const { setTenantConfig } = useTenant();
  const { redirect, setErrors } = useContext(ErrorHandlingContext);

  const { project, setProject, bulkMethod, setBulkMethod, planetCashAccount } =
    useBulkCode();

  console.log(
    '/progile/bulk-codes/[method]/[id].tsx: ',
    pageProps.tenantConfig
  );

  // Checks context and sets project, bulk method if not already set within context
  const checkContext = useCallback(async () => {
    if (planetCashAccount) {
      if (!project) {
        if (isReady) {
          try {
            const paymentOptions = await getRequest<PaymentOptions>(
              pageProps.tenantConfig.id,
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

  React.useEffect(() => {
    if (router.isReady) {
      setTenantConfig(pageProps.tenantConfig);
    }
  }, [router.isReady]);

  useEffect(() => {
    checkContext();
  }, [checkContext]);

  return pageProps.tenantConfig ? (
    <UserLayout>
      <Head>
        <title>{ready ? t('bulkCodesTitleStep3') : ''}</title>
      </Head>
      <BulkCodes step={BulkCodeSteps.ISSUE_CODES} />
    </UserLayout>
  ) : (
    <></>
  );
}

export const getStaticPaths = async () => {
  const subDomainPaths = await constructPathsForTenantSlug();

  const paths = subDomainPaths.map((path) => {
    return {
      params: {
        slug: path.params.slug,
        method: v4(),
        id: v4(),
      },
    };
  });

  return {
    paths: paths,
    fallback: 'blocking',
  };
};

interface StaticProps {
  tenantConfig: Tenant;
}

export const getStaticProps: GetStaticProps<StaticProps> = async (
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<StaticProps>> => {
  const tenantConfig =
    (await getTenantConfig(context.params?.slug as string)) ?? defaultTenant;

  return {
    props: {
      ...(await serverSideTranslations(
        context.locale || 'en',
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
      tenantConfig,
    },
  };
};
