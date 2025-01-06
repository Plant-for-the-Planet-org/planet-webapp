import type { AbstractIntlMessages } from 'next-intl';
import type { ReactElement } from 'react';
import type {
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';

import Head from 'next/head';
import { useTranslations } from 'next-intl';
import UserLayout from '../../../../../src/features/common/Layout/UserLayout/UserLayout';
import ImpersonateUser from '../../../../../src/features/user/Settings/ImpersonateUser';
import { useUserProps } from '../../../../../src/features/common/Layout/UserPropsContext';
import { useEffect } from 'react';
import AccessDeniedLoader from '../../../../../src/features/common/ContentLoaders/Projects/AccessDeniedLoader';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../src/utils/multiTenancy/helpers';
import { defaultTenant } from '../../../../../tenant.config';
import type { Tenant } from '@planet-sdk/common/build/types/tenant';
import { useRouter } from 'next/router';
import { useTenant } from '../../../../../src/features/common/Layout/TenantContext';
import getMessagesForPage from '../../../../../src/utils/language/getMessagesForPage';

interface Props {
  pageProps: PageProps;
}

const ImpersonateUserPage = ({
  pageProps: { tenantConfig },
}: Props): ReactElement => {
  const { user, isImpersonationModeOn } = useUserProps();
  const t = useTranslations('Me');
  const router = useRouter();
  const { setTenantConfig } = useTenant();

  useEffect(() => {
    if (router.isReady) {
      setTenantConfig(tenantConfig);
    }
  }, [router.isReady]);

  return tenantConfig ? (
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
  ) : (
    <></>
  );
};

export default ImpersonateUserPage;

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

  const messages = await getMessagesForPage({
    locale: context.params?.locale as string,
    filenames: ['common', 'me', 'country'],
  });

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};
