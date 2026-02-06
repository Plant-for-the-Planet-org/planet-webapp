import type { ReactElement } from 'react';
import type { AbstractIntlMessages } from 'next-intl';
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';

import Head from 'next/head';
import UserLayout from '../../../../../../src/features/common/Layout/UserLayout/UserLayout';
import MySpecies from '../../../../../../src/features/user/TreeMapper/MySpecies';
import { useTranslations } from 'next-intl';
import { useUserProps } from '../../../../../../src/features/common/Layout/UserPropsContext';
import AccessDeniedLoader from '../../../../../../src/features/common/ContentLoaders/Projects/AccessDeniedLoader';
import { constructPathsForTenantSlug } from '../../../../../../src/utils/multiTenancy/helpers';
import getMessagesForPage from '../../../../../../src/utils/language/getMessagesForPage';
import { useTenantStore } from '../../../../../../src/stores/tenantStore';

export default function MySpeciesPage(): ReactElement {
  const t = useTranslations('Me');
  const { user } = useUserProps();
  // store: action
  const tenantConfig = useTenantStore((state) => state.tenantConfig);
  if (!tenantConfig) return <></>;

  return (
    <UserLayout>
      <Head>
        <title>{t('mySpecies')}</title>
      </Head>
      {user?.type === 'tpo' ? <MySpecies /> : <AccessDeniedLoader />}
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
}

export const getStaticProps: GetStaticProps<PageProps> = async (
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<PageProps>> => {
  const messages = await getMessagesForPage({
    locale: context.params?.locale as string,
    filenames: ['common', 'me', 'country', 'treemapper'],
  });

  return {
    props: {
      messages,
    },
  };
};
