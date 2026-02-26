import type { ReactElement } from 'react';
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import type { AbstractIntlMessages } from 'next-intl';
import type { APIError } from '@planet-sdk/common';
import type { Tenant } from '@planet-sdk/common/build/types/tenant';
import type { PaymentOptions } from '../../../../../../../src/features/user/BulkCodes/BulkCodesTypes';

import { useEffect, useCallback } from 'react';
import UserLayout from '../../../../../../../src/features/common/Layout/UserLayout/UserLayout';
import BulkCodes, {
  BulkCodeSteps,
} from '../../../../../../../src/features/user/BulkCodes';
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
import { useTenant } from '../../../../../../../src/features/common/Layout/TenantContext';
import { defaultTenant } from '../../../../../../../tenant.config';
import getMessagesForPage from '../../../../../../../src/utils/language/getMessagesForPage';
import { useApi } from '../../../../../../../src/hooks/useApi';
import useLocalizedPath from '../../../../../../../src/hooks/useLocalizedPath';
import {
  useAuthStore,
  useUserStore,
  useErrorHandlingStore,
} from '../../../../../../../src/stores';
import { useBulkCodeStore } from '../../../../../../../src/stores/bulkCodeStore';

interface Props {
  pageProps: PageProps;
}

export default function BulkCodeIssueCodesPage({
  pageProps,
}: Props): ReactElement {
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  const t = useTranslations('Me');
  const { setTenantConfig } = useTenant();
  const { getApiAuthenticated } = useApi();
  //store: state
  const isAuthReady = useAuthStore((state) =>
    Boolean(state.token && state.isAuthResolved)
  );
  const userProfile = useUserStore((state) => state.userProfile);
  const isBulkMethodSet = useBulkCodeStore(
    (state) => state.bulkMethod !== null
  );
  const projectList = useBulkCodeStore((state) => state.projectList);
  const project = useBulkCodeStore((state) => state.project);
  const planetCashAccount = useBulkCodeStore(
    (state) => state.planetCashAccount
  );
  //store: action
  const setErrors = useErrorHandlingStore((state) => state.setErrors);
  const setBulkMethod = useBulkCodeStore((state) => state.setBulkMethod);
  const setProject = useBulkCodeStore((state) => state.setProject);

  // Checks context and sets project, bulk method if not already set within context
  const checkContext = useCallback(async () => {
    if (!planetCashAccount || !isAuthReady || !projectList) return;

    if (!project) {
      if (!router.isReady) {
        router.push(localizedPath('/profile/bulk-codes'));
        return;
      }
    }

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

    if (!isBulkMethodSet && router.isReady) {
      const { method } = router.query;

      const isValidMethod =
        method === BulkCodeMethods.GENERIC || method === BulkCodeMethods.IMPORT;

      isValidMethod
        ? setBulkMethod(method)
        : router.push(localizedPath('/profile/bulk-codes'));
    }
  }, [router.isReady, planetCashAccount, isAuthReady, projectList]);

  useEffect(() => {
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
        <title>{t('bulkCodesTitleStep3')}</title>
      </Head>
      <BulkCodes step={BulkCodeSteps.ISSUE_CODES} />
    </UserLayout>
  ) : (
    <></>
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
  const tenantConfig =
    (await getTenantConfig(context.params?.slug as string)) ?? defaultTenant;

  const messages = await getMessagesForPage({
    locale: context.params?.locale as string,
    filenames: ['common', 'me', 'country', 'bulkCodes'],
  });

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};
