import { MyForestProvider } from '../../../../../src/features/common/Layout/MyForestContext';
import type { Tenant } from '@planet-sdk/common/build/types/tenant';
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import type { AbstractIntlMessages } from 'next-intl';

import { useTranslations } from 'next-intl';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../src/utils/multiTenancy/helpers';
import getMessagesForPage from '../../../../../src/utils/language/getMessagesForPage';
import { defaultTenant } from '../../../../../tenant.config';
import UserLayout from '../../../../../src/features/common/Layout/UserLayout/UserLayout';
import Head from 'next/head';
import ProfileOuterContainer from '../../../../../src/features/user/Profile/ProfileOuterContainer';
import ProfileLayout from '../../../../../src/features/user/Profile/ProfileLayout';

interface Props {
  pageProps: PageProps;
}

const MyForestPage = ({ pageProps: { tenantConfig } }: Props) => {
  const t = useTranslations('Me');

  return tenantConfig ? (
    <UserLayout>
      <Head>
        <title>{t('profile')}</title>
      </Head>
      <MyForestProvider>
        <ProfileOuterContainer>
          <ProfileLayout />
        </ProfileOuterContainer>
      </MyForestProvider>
    </UserLayout>
  ) : (
    <></>
  );
};

export default MyForestPage;

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
    filenames: [
      'common',
      'me',
      'country',
      'redeem',
      'donate',
      'profile',
      'project',
    ],
  });

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};
