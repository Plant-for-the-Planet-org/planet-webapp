import type { ReactElement } from 'react';
import type { AbstractIntlMessages } from 'next-intl';
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import type { Tenant } from '@planet-sdk/common/build/types/tenant';

import { useEffect } from 'react';
import UserLayout from '../../../../../../../src/features/common/Layout/UserLayout/UserLayout';
import BulkCodes, {
  BulkCodeSteps,
} from '../../../../../../../src/features/user/BulkCodes';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useLocalizedPath from '../../../../../../../src/hooks/useLocalizedPath';
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
import { useBulkCodeStore } from '../../../../../../../src/stores/bulkCodeStore';

interface Props {
  pageProps: PageProps;
}

export default function BulkCodeSelectProjectPage({
  pageProps,
}: Props): ReactElement {
  const t = useTranslations('Me');
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  const { setTenantConfig } = useTenant();
  // store: state
  const isBulkMethodSet = useBulkCodeStore(
    (state) => state.bulkMethod !== null
  );
  // store: action
  const setBulkMethod = useBulkCodeStore((state) => state.setBulkMethod);

  useEffect(() => {
    if (router.isReady) {
      setTenantConfig(pageProps.tenantConfig);
    }
  }, [router.isReady]);

  // Sets bulk method if not already set within context when page is loaded
  useEffect(() => {
    if (!isBulkMethodSet && router.isReady) {
      const { method } = router.query;

      const isValidMethod =
        method === BulkCodeMethods.GENERIC || method === BulkCodeMethods.IMPORT;

      isValidMethod
        ? setBulkMethod(method)
        : router.push(localizedPath('/profile/bulk-codes'));
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
