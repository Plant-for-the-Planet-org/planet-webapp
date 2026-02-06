import type { ReactElement } from 'react';
import type { AbstractIntlMessages } from 'next-intl';
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';

import Head from 'next/head';
import { useEffect } from 'react';
import UserLayout from '../../../../../../src/features/common/Layout/UserLayout/UserLayout';
import Analytics from '../../../../../../src/features/user/TreeMapper/Analytics';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import useLocalizedPath from '../../../../../../src/hooks/useLocalizedPath';
import { useUserProps } from '../../../../../../src/features/common/Layout/UserPropsContext';
import { constructPathsForTenantSlug } from '../../../../../../src/utils/multiTenancy/helpers';
import getMessagesForPage from '../../../../../../src/utils/language/getMessagesForPage';
import { useTenantStore } from '../../../../../../src/stores/tenantStore';

function TreeMapperAnalytics(): ReactElement {
  const t = useTranslations('TreemapperAnalytics');
  const { user } = useUserProps();
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  // store: action
  const tenantConfig = useTenantStore((state) => state.tenantConfig);

  useEffect(() => {
    if (user) {
      if (!(process.env.ENABLE_ANALYTICS && user.type === 'tpo')) {
        router.push(localizedPath('/profile'));
      }
    }
  }, [user]);

  if (!tenantConfig) return <></>;

  return (
    <UserLayout>
      <Head>
        <title> {t('title')} </title>
      </Head>
      <Analytics />
    </UserLayout>
  );
}

export default TreeMapperAnalytics;

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
    filenames: ['common', 'me', 'country', 'treemapperAnalytics'],
  });

  return {
    props: {
      messages,
    },
  };
};
