import Head from 'next/head';
import React, { ReactElement } from 'react';
import UserLayout from '../../../../../../src/features/common/Layout/UserLayout/UserLayout';
import TreeMapper from '../../../../../../src/features/user/TreeMapper';
import { AbstractIntlMessages, useTranslations } from 'next-intl';
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../../src/utils/multiTenancy/helpers';
import { defaultTenant } from '../../../../../../tenant.config';
import { Tenant } from '@planet-sdk/common/build/types/tenant';
import { useRouter } from 'next/router';
import { useTenant } from '../../../../../../src/features/common/Layout/TenantContext';
import getMessagesForPage from '../../../../../../src/utils/language/getMessagesForPage';

interface Props {
  pageProps: PageProps;
}

function TreeMapperPage({ pageProps: { tenantConfig } }: Props): ReactElement {
  // TODO - remove this
  // if (typeof window !== 'undefined') {
  //   router.push('/');
  // }
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
        <title>{t('treemapper')}</title>
      </Head>
      <TreeMapper />
    </UserLayout>
  ) : (
    <></>
  );
}

export default TreeMapperPage;

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
    filenames: ['common', 'me', 'country', 'treemapper', 'maps'],
  });

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};
