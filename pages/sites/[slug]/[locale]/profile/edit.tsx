import type { ReactElement } from 'react';
import type { AbstractIntlMessages } from 'next-intl';
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';

import Head from 'next/head';
import UserLayout from '../../../../../src/features/common/Layout/UserLayout/UserLayout';
import { useTranslations } from 'next-intl';
import EditProfile from '../../../../../src/features/user/Settings/EditProfile';
import { constructPathsForTenantSlug } from '../../../../../src/utils/multiTenancy/helpers';
import getMessagesForPage from '../../../../../src/utils/language/getMessagesForPage';
import { useTenantStore } from '../../../../../src/stores/tenantStore';

function EditProfilePage(): ReactElement {
  const t = useTranslations('Me');
  //store: action
  const tenantConfig = useTenantStore((state) => state.tenantConfig);

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
    filenames: ['common', 'me', 'country', 'editProfile', 'profile'],
  });

  return {
    props: {
      messages,
    },
  };
};
