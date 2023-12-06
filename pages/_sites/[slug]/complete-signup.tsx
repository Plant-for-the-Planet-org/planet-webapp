import React from 'react';
import CompleteSignup from '../../../src/features/user/CompleteSignup';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../src/utils/multiTenancy/helpers';
import { Tenant } from '@planet-sdk/common/build/types/tenant';
import { useRouter } from 'next/router';
import { useTenant } from '../../../src/features/common/Layout/TenantContext';

interface Props {
  pageProps: {
    tenantConfig: Tenant;
  };
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

export async function getStaticPaths() {
  return {
    paths: await constructPathsForTenantSlug(),
    fallback: 'blocking',
  };
}

export async function getStaticProps(props: any) {
  const tenantConfig = await getTenantConfig(props.params.slug);

  return {
    props: {
      ...(await serverSideTranslations(
        props.locale || 'en',
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
}
