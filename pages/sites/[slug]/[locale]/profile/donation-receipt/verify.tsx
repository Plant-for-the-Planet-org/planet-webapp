import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import type { AbstractIntlMessages } from 'next-intl';

import Head from 'next/head';
import UserLayout from '../../../../../../src/features/common/Layout/UserLayout/UserLayout';
import { constructPathsForTenantSlug } from '../../../../../../src/utils/multiTenancy/helpers';
import getMessagesForPage from '../../../../../../src/utils/language/getMessagesForPage';
import DonationReceiptAuthenticated from '../../../../../../src/features/user/DonationReceipt/DonationReceiptAuthenticated';
import { useTranslations } from 'next-intl';

export default function DonationReceiptPage() {
  const tReceipt = useTranslations('DonationReceipt');

  return (
    <UserLayout>
      <Head>
        <title>{tReceipt('receipts')}</title>
      </Head>
      <DonationReceiptAuthenticated />
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
    filenames: ['common', 'me', 'country', 'donationReceipt'],
  });

  return {
    props: {
      messages,
    },
  };
};
