import type { ReactElement } from 'react';
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import type { AbstractIntlMessages } from 'next-intl';
import type { APIError, Tenant } from '@planet-sdk/common';
import type { PaymentOptions } from '../../../../../../../src/features/user/BulkCodes/BulkCodesTypes';

import { useEffect, useCallback } from 'react';
import UserLayout from '../../../../../../../src/features/common/Layout/UserLayout/UserLayout';
import BulkCodes, {
  BulkCodeSteps,
} from '../../../../../../../src/features/user/BulkCodes';
import BulkCodesSkeleton from '../../../../../../../src/features/user/BulkCodes/BulkCodesSkeleton';
import Head from 'next/head';
import { BulkCodeMethods } from '../../../../../../../src/utils/constants/bulkCodeConstants';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import { handleError } from '@planet-sdk/common';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../../../src/utils/multiTenancy/helpers';
import { v4 } from 'uuid';
import getMessagesForPage from '../../../../../../../src/utils/language/getMessagesForPage';
import { useApi } from '../../../../../../../src/hooks/useApi';
import useLocalizedPath from '../../../../../../../src/hooks/useLocalizedPath';
import {
  useAuthStore,
  useUserStore,
  useErrorHandlingStore,
  useTenantStore,
  useBulkCodeStore,
} from '../../../../../../../src/stores';
import { defaultTenant } from '../../../../../../../tenant.config';

export default function BulkCodeIssueCodesPage(): ReactElement {
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  const t = useTranslations('Me');
  const { getApiAuthenticated } = useApi();
  //store: state
  const isAuthReady = useAuthStore((state) =>
    Boolean(state.token && state.isAuthResolved)
  );
  const userProfile = useUserStore((state) => state.userProfile);
  const bulkMethod = useBulkCodeStore((state) => state.bulkMethod);
  const projectList = useBulkCodeStore((state) => state.projectList);
  const project = useBulkCodeStore((state) => state.project);
  const planetCashAccount = useBulkCodeStore(
    (state) => state.planetCashAccount
  );
  const isInitialized = useTenantStore((state) => state.isInitialized);
  //store: action
  const setErrors = useErrorHandlingStore((state) => state.setErrors);
  const setBulkMethod = useBulkCodeStore((state) => state.setBulkMethod);
  const setProject = useBulkCodeStore((state) => state.setProject);

  const { method } = router.query;
  const isValidMethod =
    method === BulkCodeMethods.GENERIC || method === BulkCodeMethods.IMPORT;
  const isContentReady = router.isReady && isValidMethod;

  // Checks context and sets project; keeps the store's bulk method in sync
  // with the route method, so navigating between methods doesn't leave a
  // stale value.
  const checkContext = useCallback(async () => {
    if (!router.isReady) return;
    if (!isValidMethod) {
      router.push(localizedPath('/profile/bulk-codes'));
      return;
    }
    if (!planetCashAccount || !isAuthReady || !projectList) return;
    if (!project) {
      try {
        const paymentOptions = await getApiAuthenticated<PaymentOptions>(
          `/app/paymentOptions/${router.query.id}`,
          {
            queryParams: {
              country: planetCashAccount?.country ?? '',
              ...(userProfile !== null && {
                legacyPriceFor: userProfile.id,
              }),
            },
          }
        );

        if (!paymentOptions) return;

        const retrievedProject = projectList.find(
          (project) => project.guid === paymentOptions.id
        );

        if (!retrievedProject) throw new Error('Project not found');

        Object.assign(retrievedProject, {
          currency: paymentOptions.currency,
          unitCost: paymentOptions.unitCost,
          unitType: paymentOptions.unitType,
          purpose: paymentOptions.purpose,
        });

        setProject(retrievedProject);
      } catch (err) {
        setErrors(handleError(err as APIError));
        router.push(localizedPath('/'));
      }
    }

    if (bulkMethod !== method) setBulkMethod(method);
  }, [
    router.isReady,
    planetCashAccount,
    isAuthReady,
    projectList,
    project,
    isValidMethod,
    method,
    bulkMethod,
  ]);

  useEffect(() => {
    checkContext();
  }, [checkContext]);

  if (!isInitialized) return <></>;

  const skeleton = <BulkCodesSkeleton step={BulkCodeSteps.ISSUE_CODES} />;

  return (
    <UserLayout skeleton={skeleton}>
      {isContentReady ? (
        <>
          <Head>
            <title>{t('bulkCodesTitleStep3')}</title>
          </Head>
          <BulkCodes step={BulkCodeSteps.ISSUE_CODES} />
        </>
      ) : (
        skeleton
      )}
    </UserLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const subDomainPaths = await constructPathsForTenantSlug();

  const paths =
    subDomainPaths?.map((path) => {
      return {
        params: {
          slug: path.params.slug,
          method: v4(),
          id: v4(),
          locale: 'en',
        },
      };
    }) ?? [];

  return {
    paths: paths,
    fallback: 'blocking',
  };
};

interface PageProps {
  messages: AbstractIntlMessages;
  tenantConfig: Tenant;
}

export const getStaticProps: GetStaticProps<PageProps> = async (
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<PageProps>> => {
  const messages = await getMessagesForPage({
    locale: context.params?.locale as string,
    filenames: ['common', 'me', 'country', 'bulkCodes'],
  });

  const tenantConfig =
    (await getTenantConfig(context.params?.slug as string)) ?? defaultTenant;

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};
