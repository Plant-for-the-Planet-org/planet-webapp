import Head from 'next/head';
import React, { ReactElement } from 'react';
import UserLayout from '../../../../src/features/common/Layout/UserLayout/UserLayout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import EditProfile from '../../../../src/features/user/Settings/EditProfile';
import {
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../src/utils/multiTenancy/helpers';
import { Tenant } from '@planet-sdk/common/build/types/tenant';
import { defaultTenant } from '../../../../tenant.config';
import { useRouter } from 'next/router';
import { useTenant } from '../../../../src/features/common/Layout/TenantContext';

interface Props {
  pageProps: {
    tenantConfig: Tenant;
  };
}

function EditProfilePage({ pageProps: { tenantConfig } }: Props): ReactElement {
  const { t } = useTranslation('me');
  const router = useRouter();
  const { setTenantConfig } = useTenant();

  React.useEffect(() => {
    if (router.isReady) {
      setTenantConfig(tenantConfig);
    }
  }, [router.isReady]);

  return tenantConfig ? (
    <UserLayout>
      <Head>
        <title>{t('editProfile')}</title>
      </Head>
      <EditProfile />
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
        ['editProfile', 'me', 'common', 'country'],
        null,
        ['en', 'de', 'fr', 'es', 'it', 'pt-BR', 'cs']
      )),
      tenantConfig,
    },
  };
};
