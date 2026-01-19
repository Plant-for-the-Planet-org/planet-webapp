import type { ReactElement } from 'react';
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import type { AbstractIntlMessages } from 'next-intl';

import GiftFunds from '../../../../../../src/features/user/GiftFunds';
import UserLayout from '../../../../../../src/features/common/Layout/UserLayout/UserLayout';
import Head from 'next/head';
import { useTranslations } from 'next-intl';
import { constructPathsForTenantSlug } from '../../../../../../src/utils/multiTenancy/helpers';
import getMessagesForPage from '../../../../../../src/utils/language/getMessagesForPage';
import { useTenantStore } from '../../../../../../src/stores/tenantStore';

export default function Register(): ReactElement {
  const t = useTranslations('Me');

  //store: action
  const tenantConfig = useTenantStore((state) => state.tenantConfig);

  if (!tenantConfig) return <></>;

  return (
    <UserLayout>
      <Head>
        <title>{t('giftFund')}</title>
      </Head>
      <GiftFunds />
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
    filenames: ['common', 'me', 'country', 'giftfunds'],
  });

  return {
    props: {
      messages,
    },
  };
};
