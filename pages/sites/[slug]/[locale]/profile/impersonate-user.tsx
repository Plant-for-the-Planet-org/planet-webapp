import type { AbstractIntlMessages } from 'next-intl';
import type { ReactElement } from 'react';
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import type { Tenant } from '@planet-sdk/common/build/types/tenant';

import Head from 'next/head';
import { useTranslations } from 'next-intl';
import UserLayout from '../../../../../src/features/common/Layout/UserLayout/UserLayout';
import ImpersonateUser from '../../../../../src/features/user/Settings/ImpersonateUser';
import AccessDeniedLoader from '../../../../../src/features/common/ContentLoaders/Projects/AccessDeniedLoader';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../src/utils/multiTenancy/helpers';
import { defaultTenant } from '../../../../../tenant.config';
import getMessagesForPage from '../../../../../src/utils/language/getMessagesForPage';
import { useUserStore, useTenantStore } from '../../../../../src/stores';

const ImpersonateUserPage = (): ReactElement => {
  const t = useTranslations('Me');
  // store: state
  const isImpersonationModeOn = useUserStore(
    (state) => state.isImpersonationModeOn
  );
  const hasImpersonationAccess = useUserStore(
    (state) => state.userProfile?.allowedToSwitch
  );
  const isInitialized = useTenantStore((state) => state.isInitialized);

  if (!isInitialized) return <></>;

  return (
    <UserLayout>
      <Head>
        <title>{t('switchUser')}</title>
      </Head>
      {hasImpersonationAccess && !isImpersonationModeOn ? (
        <ImpersonateUser />
      ) : (
        <AccessDeniedLoader />
      )}
    </UserLayout>
  );
};

export default ImpersonateUserPage;

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
    filenames: ['common', 'me', 'country'],
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
