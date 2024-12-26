import React from 'react';
import CompleteSignup from '../../../../src/features/user/CompleteSignup';
import Head from 'next/head';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../src/utils/multiTenancy/helpers';
import { Tenant } from '@planet-sdk/common/build/types/tenant';
import { useRouter } from 'next/router';
import { useTenant } from '../../../../src/features/common/Layout/TenantContext';
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import { defaultTenant } from '../../../../tenant.config';
import { AbstractIntlMessages } from 'next-intl';
import getMessagesForPage from '../../../../src/utils/language/getMessagesForPage';

interface Props {
  pageProps: PageProps;
}

export default function UserProfile({ pageProps }: Props) {
  const router = useRouter();
  const { setTenantConfig } = useTenant();

  React.useEffect(() => {
    if (router.isReady) {
      setTenantConfig(pageProps.tenantConfig);
    }
  }, [router.isReady]);

  return pageProps.tenantConfig ? (
    <>
      <Head>
        <title>{`${pageProps.tenantConfig.config.meta.title} - Complete SignUp`}</title>
      </Head>
      <CompleteSignup />
    </>
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
  const tenantConfig =
    (await getTenantConfig(context.params?.slug as string)) ?? defaultTenant;

  const messages = await getMessagesForPage({
    locale: context.params?.locale as string,
    filenames: ['common', 'me', 'country', 'editProfile'],
  });

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};
