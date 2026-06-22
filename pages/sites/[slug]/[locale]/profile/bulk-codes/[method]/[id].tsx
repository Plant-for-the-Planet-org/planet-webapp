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
import Head from 'next/head';
import { BulkCodeMethods } from '../../../../../../../src/utils/constants/bulkCodeConstants';
import { useBulkCode } from '../../../../../../../src/features/common/Layout/BulkCodeContext';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import { handleError } from '@planet-sdk/common';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../../../src/utils/multiTenancy/helpers';
import { v4 } from 'uuid';
import getMessagesForPage from '../../../../../../../src/utils/language/getMessagesForPage';
import { useUserProps } from '../../../../../../../src/features/common/Layout/UserPropsContext';
import { useApi } from '../../../../../../../src/hooks/useApi';
import useLocalizedPath from '../../../../../../../src/hooks/useLocalizedPath';
import { useTenantStore } from '../../../../../../../src/stores/tenantStore';
import { useErrorHandlingStore } from '../../../../../../../src/stores/errorHandlingStore';
import { defaultTenant } from '../../../../../../../tenant.config';

export default function BulkCodeIssueCodesPage(): ReactElement {
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  const t = useTranslations('Me');
  const { getApiAuthenticated } = useApi();
  const {
    project,
    setProject,
    bulkMethod,
    setBulkMethod,
    planetCashAccount,
    projectList,
  } = useBulkCode();
  const { token, user, contextLoaded } = useUserProps();
  // store: action
  const isInitialized = useTenantStore((state) => state.isInitialized);
  // store: state
  const setErrors = useErrorHandlingStore((state) => state.setErrors);

  // Checks context and sets project, bulk method if not already set within context
  const checkContext = useCallback(async () => {
    if (planetCashAccount && token && contextLoaded && projectList) {
      if (!project) {
        if (router.isReady) {
          try {
            const paymentOptions = await getApiAuthenticated<PaymentOptions>(
              `/app/paymentOptions/${router.query.id}`,
              {
                queryParams: {
                  country: planetCashAccount?.country ?? '',
                  ...(user !== null && { legacyPriceFor: user.id }),
                },
              }
            );
            if (paymentOptions) {
              const retrievedProject = projectList.find(
                (project) => project.guid === paymentOptions.id
              );
              if (!retrievedProject) {
                throw new Error('Project not found');
              }
              retrievedProject.currency = paymentOptions.currency;
              retrievedProject.unitCost = paymentOptions.unitCost;
              retrievedProject.unitType = paymentOptions.unitType;
              retrievedProject.purpose = paymentOptions.purpose;
              setProject(retrievedProject);
            }
          } catch (err) {
            setErrors(handleError(err as APIError));
            router.push(localizedPath('/'));
          }
        } else {
          router.push(localizedPath('/profile/bulk-codes'));
        }
      }

      if (!bulkMethod) {
        if (router.isReady) {
          const _bulkMethod = router.query.method;
          if (
            _bulkMethod === BulkCodeMethods.GENERIC ||
            _bulkMethod === BulkCodeMethods.IMPORT
          ) {
            setBulkMethod(_bulkMethod);
          } else {
            router.push(localizedPath('/profile/bulk-codes'));
          }
        }
      }
    }
  }, [router.isReady, planetCashAccount, token, contextLoaded, projectList]);

  useEffect(() => {
    checkContext();
  }, [checkContext]);

  if (!isInitialized) return <></>;

  return (
    <UserLayout>
      <Head>
        <title>{t('bulkCodesTitleStep3')}</title>
      </Head>
      <BulkCodes step={BulkCodeSteps.ISSUE_CODES} />
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
