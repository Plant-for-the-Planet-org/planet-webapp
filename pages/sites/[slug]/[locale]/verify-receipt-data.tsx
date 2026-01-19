import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import type { AbstractIntlMessages } from 'next-intl';

import { constructPathsForTenantSlug } from '../../../../src/utils/multiTenancy/helpers';
import getMessagesForPage from '../../../../src/utils/language/getMessagesForPage';
import DonationReceiptUnauthenticated from '../../../../src/features/user/DonationReceipt/DonationReceiptUnauthenticated';
import { useTenantStore } from '../../../../src/stores/tenantStore';

interface PageProps {
  messages: AbstractIntlMessages;
}

export default function DonationReceipt() {
  //store: action
  const tenantConfig = useTenantStore((state) => state.tenantConfig);
  if (!tenantConfig) return <></>;

  return <DonationReceiptUnauthenticated />;
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
