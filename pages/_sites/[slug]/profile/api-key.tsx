import Head from 'next/head';
import React, { ReactElement } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ApiKey from '../../../../src/features/user/Settings/ApiKey';
import {
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import UserLayout from '../../../../src/features/common/Layout/UserLayout/UserLayout';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../src/utils/multiTenancy/helpers';
import { defaultTenant } from '../../../../tenant.config';
import { Tenant } from '@planet-sdk/common/build/types/tenant';
import { useRouter } from 'next/router';
import { useTenant } from '../../../../src/features/common/Layout/TenantContext';

interface Props {
  pageProps: {
    tenantConfig: Tenant;
  };
}

function EditProfilePage({ pageProps }: Props): ReactElement {
  const { t } = useTranslation('me');
  const router = useRouter();
  const { setTenantConfig } = useTenant();

  const { tenantConfig } = pageProps;

  React.useEffect(() => {
    if (router.isReady) {
      setTenantConfig(tenantConfig);
    }
  }, [router.isReady]);

  return tenantConfig ? (
    <UserLayout>
      <Head>
        <title>{t('apiKey')}</title>
      </Head>
      <ApiKey />
    </UserLayout>
  ) : (
    <></>
  );
}

export default EditProfilePage;

export async function getStaticPaths() {
  const paths = await constructPathsForTenantSlug();
  return {
    paths: paths,
    fallback: 'blocking',
  };
}

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
