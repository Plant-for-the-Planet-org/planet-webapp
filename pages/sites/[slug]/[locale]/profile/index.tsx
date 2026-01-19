import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import type { AbstractIntlMessages } from 'next-intl';

import { useTranslations } from 'next-intl';
import { constructPathsForTenantSlug } from '../../../../../src/utils/multiTenancy/helpers';
import getMessagesForPage from '../../../../../src/utils/language/getMessagesForPage';
import UserLayout from '../../../../../src/features/common/Layout/UserLayout/UserLayout';
import Head from 'next/head';
import ProfileOuterContainer from '../../../../../src/features/user/Profile/ProfileOuterContainer';
import ProfileLayout from '../../../../../src/features/user/Profile/ProfileLayout';
import { useTenantStore } from '../../../../../src/stores/tenantStore';

const MyForestPage = () => {
  const t = useTranslations('Me');
  const tenantConfig = useTenantStore((state) => state.tenantConfig);
  if (!tenantConfig) return <></>;

  return (
    <UserLayout>
      <Head>
        <title>{t('profile')}</title>
      </Head>

      <ProfileOuterContainer>
        <ProfileLayout />
      </ProfileOuterContainer>
    </UserLayout>
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
}

export const getStaticProps: GetStaticProps<PageProps> = async (
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<PageProps>> => {
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
    },
  };
};
