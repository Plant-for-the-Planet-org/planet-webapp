import Head from 'next/head';
import React, { ReactElement } from 'react';
import UserLayout from '../../../../../src/features/common/Layout/UserLayout/UserLayout';
import deepmerge from 'deepmerge';
import { AbstractIntlMessages, useTranslations } from 'next-intl';
import EditProfile from '../../../../../src/features/user/Settings/EditProfile';
import {
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../src/utils/multiTenancy/helpers';
import { Tenant } from '@planet-sdk/common/build/types/tenant';
import { defaultTenant } from '../../../../../tenant.config';
import { useRouter } from 'next/router';
import { useTenant } from '../../../../../src/features/common/Layout/TenantContext';

interface Props {
  pageProps: {
    tenantConfig: Tenant;
  };
}

function EditProfilePage({ pageProps: { tenantConfig } }: Props): ReactElement {
  const t = useTranslations('Me');
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

export const getStaticPaths = async () => {
  const subDomainPaths = await constructPathsForTenantSlug();

  const paths = subDomainPaths.map((path) => {
    return {
      params: {
        slug: path.params.slug,
        locale: 'en',
      },
    };
  });

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

  const userMessages = {
    ...(
      await import(
        `../../../../../public/static/locales/${context.params?.locale}/common.json`
      )
    ).default,
    ...(
      await import(
        `../../../../../public/static/locales/${context.params?.locale}/me.json`
      )
    ).default,
    ...(
      await import(
        `../../../../../public/static/locales/${context.params?.locale}/country.json`
      )
    ).default,
    ...(
      await import(
        `../../../../../public/static/locales/${context.params?.locale}/editProfile.json`
      )
    ).default,
  };

  const defaultMessages = {
    ...(await import('../../../../../public/static/locales/en/common.json'))
      .default,
    ...(await import('../../../../../public/static/locales/en/me.json'))
      .default,
    ...(await import('../../../../../public/static/locales/en/country.json'))
      .default,
    ...(
      await import('../../../../../public/static/locales/en/editProfile.json')
    ).default,
  };

  const messages: AbstractIntlMessages = deepmerge(
    defaultMessages,
    userMessages
  );

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};
