import type { ReactElement } from 'react';
import type { AbstractIntlMessages } from 'next-intl';
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';

import UserLayout from '../../../../../src/features/common/Layout/UserLayout/UserLayout';
import Head from 'next/head';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { constructPathsForTenantSlug } from '../../../../../src/utils/multiTenancy/helpers';
import getMessagesForPage from '../../../../../src/utils/language/getMessagesForPage';
import { useTenantStore } from '../../../../../src/stores/tenantStore';

const RegisterTrees = dynamic(
  () => import('../../../../../src/features/user/RegisterTrees')
);

export default function Register(): ReactElement {
  const t = useTranslations('Me');

  //store: action
  const tenantConfig = useTenantStore((state) => state.tenantConfig);

  if (!tenantConfig) return <></>;

  return (
    <UserLayout>
      <Head>
        <title>{t('registerTrees')}</title>
      </Head>
      <RegisterTrees />
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
    filenames: ['common', 'me', 'country', 'profile', 'donate'],
  });

  return {
    props: {
      messages,
    },
  };
};
