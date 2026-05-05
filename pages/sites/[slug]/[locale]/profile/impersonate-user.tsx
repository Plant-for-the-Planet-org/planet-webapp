import type { AbstractIntlMessages } from 'next-intl';
import type { ReactElement } from 'react';
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import type { Tenant } from '@planet-sdk/common';

import Head from 'next/head';
import { useTranslations } from 'next-intl';
import UserLayout from '../../../../../src/features/common/Layout/UserLayout/UserLayout';
import ImpersonateUser from '../../../../../src/features/user/Settings/ImpersonateUser';
import { useUserProps } from '../../../../../src/features/common/Layout/UserPropsContext';
import AccessDeniedLoader from '../../../../../src/features/common/ContentLoaders/Projects/AccessDeniedLoader';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../src/utils/multiTenancy/helpers';
import getMessagesForPage from '../../../../../src/utils/language/getMessagesForPage';
import { useTenantStore } from '../../../../../src/stores/tenantStore';
import { defaultTenant } from '../../../../../tenant.config';

const ImpersonateUserPage = (): ReactElement => {
  const { user, isImpersonationModeOn } = useUserProps();
  const t = useTranslations('Me');
  //store: action
  const isInitialized = useTenantStore((state) => state.isInitialized);

  if (!isInitialized) return <></>;

  return (
    <UserLayout>
      <Head>
        <title>{t('switchUser')}</title>
      </Head>
      {user?.allowedToSwitch && !isImpersonationModeOn ? (
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
