import type { ReactElement } from 'react';
import type { AbstractIntlMessages } from 'next-intl';
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import type { Tenant } from '@planet-sdk/common/build/types/tenant';

import React, { useEffect } from 'react';
import UserLayout from '../../../../../../../src/features/common/Layout/UserLayout/UserLayout';
import BulkCodes, {
  BulkCodeSteps,
} from '../../../../../../../src/features/user/BulkCodes';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useBulkCode } from '../../../../../../../src/features/common/Layout/BulkCodeContext';
import { BulkCodeMethods } from '../../../../../../../src/utils/constants/bulkCodeConstants';
import { useTranslations } from 'next-intl';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../../../src/utils/multiTenancy/helpers';
import { v4 } from 'uuid';
import { useTenant } from '../../../../../../../src/features/common/Layout/TenantContext';
import { defaultTenant } from '../../../../../../../tenant.config';
import getMessagesForPage from '../../../../../../../src/utils/language/getMessagesForPage';

interface Props {
  pageProps: PageProps;
}

export default function BulkCodeSelectProjectPage({
  pageProps,
}: Props): ReactElement {
  const t = useTranslations('Me');
  const router = useRouter();
  const { bulkMethod, setBulkMethod } = useBulkCode();
  const { setTenantConfig } = useTenant();

  React.useEffect(() => {
    if (router.isReady) {
      setTenantConfig(pageProps.tenantConfig);
    }
  }, [router.isReady]);

  // Sets bulk method if not already set within context when page is loaded
  useEffect(() => {
    if (!bulkMethod) {
      if (router.isReady) {
        const _bulkMethod = router.query.method;
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
  }, []);

  return pageProps.tenantConfig ? (
    <UserLayout>
      <Head>
        <title>{t('bulkCodesTitleStep2')}</title>
      </Head>
      <BulkCodes step={BulkCodeSteps.SELECT_PROJECT} />
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
