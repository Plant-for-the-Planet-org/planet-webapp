import { Tenant } from '@planet-sdk/common/build/types/tenant';
import { MyForestProviderV2 } from '../../../../../src/features/common/Layout/MyForestContextV2';
import {
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import { AbstractIntlMessages } from 'next-intl';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../src/utils/multiTenancy/helpers';
import getMessagesForPage from '../../../../../src/utils/language/getMessagesForPage';
import { defaultTenant } from '../../../../../tenant.config';
import UserLayout from '../../../../../src/features/common/Layout/UserLayout/UserLayout';
import Head from 'next/head';
import ProfileOuterContainer from '../../../../../src/features/user/MFV2/ProfileOuterContainer';
import ProfileLayout from '../../../../../src/features/user/MFV2/ProfileLayout';

interface Props {
  pageProps: PageProps;
}

const MyForestPage = ({ pageProps: { tenantConfig } }: Props) => {
  return tenantConfig ? (
    <UserLayout>
      <Head>
        <title>My Forest V2</title>
      </Head>
      <MyForestProviderV2>
        <ProfileOuterContainer>
          <ProfileLayout />
        </ProfileOuterContainer>
      </MyForestProviderV2>
    </UserLayout>
  ) : (
    <></>
  );
};

export default MyForestPage;

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
