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
import ProjectsContainer from '../../../../../../src/features/user/ManageProjects/ProjectsContainer';
import UserLayout from '../../../../../../src/features/common/Layout/UserLayout/UserLayout';
import Head from 'next/head';
import { useTranslations } from 'next-intl';
import AccessDeniedLoader from '../../../../../../src/features/common/ContentLoaders/Projects/AccessDeniedLoader';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../../src/utils/multiTenancy/helpers';
import { defaultTenant } from '../../../../../../tenant.config';
import { useRouter } from 'next/router';
import { useTenant } from '../../../../../../src/features/common/Layout/TenantContext';
import getMessagesForPage from '../../../../../../src/utils/language/getMessagesForPage';
import { useUserStore } from '../../../../../../src/stores';

interface Props {
  pageProps: PageProps;
}

export default function Register({
  pageProps: { tenantConfig },
}: Props): ReactElement {
  const t = useTranslations('Me');
  const router = useRouter();
  const { setTenantConfig } = useTenant();
  // store: state
  const isTpo = useUserStore((state) => state.userProfile?.type === 'tpo');

  useEffect(() => {
    if (router.isReady) {
      setTenantConfig(tenantConfig);
    }
  }, [router.isReady]);

  return tenantConfig ? (
    <UserLayout>
      <Head>
        <title>{t('projects')}</title>
      </Head>
      {isTpo ? <ProjectsContainer /> : <AccessDeniedLoader />}
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
    filenames: ['common', 'me', 'country', 'manageProjects', 'donate'],
  });

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};
