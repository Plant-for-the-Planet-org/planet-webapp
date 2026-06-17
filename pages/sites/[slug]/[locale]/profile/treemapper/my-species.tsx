import type { ReactElement } from 'react';
import type { AbstractIntlMessages } from 'next-intl';
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import type { Tenant } from '@planet-sdk/common';

import Head from 'next/head';
import UserLayout from '../../../../../../src/features/common/Layout/UserLayout/UserLayout';
import MySpecies from '../../../../../../src/features/user/TreeMapper/MySpecies';
import { useTranslations } from 'next-intl';
import AccessDeniedLoader from '../../../../../../src/features/common/ContentLoaders/Projects/AccessDeniedLoader';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../../src/utils/multiTenancy/helpers';
import getMessagesForPage from '../../../../../../src/utils/language/getMessagesForPage';
import { useUserStore, useTenantStore } from '../../../../../../src/stores';
import { defaultTenant } from '../../../../../../tenant.config';

export default function MySpeciesPage(): ReactElement {
  const t = useTranslations('Me');
  // store: state
  const isTpo = useUserStore((state) => state.userProfile?.type === 'tpo');
  const isInitialized = useTenantStore((state) => state.isInitialized);

  if (!isInitialized) return <></>;

  return (
    <UserLayout>
      <Head>
        <title>{t('mySpecies')}</title>
      </Head>
      {isTpo ? <MySpecies /> : <AccessDeniedLoader />}
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
    filenames: ['common', 'me', 'country', 'treemapper'],
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
