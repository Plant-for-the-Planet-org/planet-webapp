import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import type { AbstractIntlMessages } from 'next-intl';
import type { Tenant } from '@planet-sdk/common';

import { getTenantConfig } from '../../../../src/utils/multiTenancy/helpers';
import { defaultTenant } from '../../../../tenant.config';
import CompleteSignup from '../../../../src/features/user/CompleteSignup';
import Head from 'next/head';
import { constructPathsForTenantSlug } from '../../../../src/utils/multiTenancy/helpers';
import getMessagesForPage from '../../../../src/utils/language/getMessagesForPage';
import { useTenantStore } from '../../../../src/stores/tenantStore';

export default function UserProfile() {
  // store: state
  const isInitialized = useTenantStore((state) => state.isInitialized);
  const tenantMetaTitle = useTenantStore(
    (state) => state.tenantConfig.config.meta.title
  );

  if (!isInitialized) return <></>;

  return (
    <>
      <Head>
        <title>{`${tenantMetaTitle} - Complete SignUp`}</title>
      </Head>
      <CompleteSignup />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const subDomainPaths = await constructPathsForTenantSlug();

  const paths =
    subDomainPaths?.map((path) => {
      return {
        params: {
          slug: path.params.slug,
          locale: 'en',
        },
      };
    }) ?? [];

  return {
    paths,
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
    filenames: ['common', 'me', 'country', 'editProfile'],
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
