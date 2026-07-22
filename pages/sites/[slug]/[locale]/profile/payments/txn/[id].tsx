import type { ReactElement } from 'react';
import type { AbstractIntlMessages } from 'next-intl';
import type { Tenant } from '@planet-sdk/common';
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import Head from 'next/head';
import { Loader2 } from 'lucide-react';
import { v4 } from 'uuid';

import {
  getPaymentsLayout,
  type NextPageWithPaymentsLayout,
} from '../../../../../../../src/features/user/PaymentHistory/PaymentsLayout';
import useLocalizedPath from '../../../../../../../src/hooks/useLocalizedPath';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../../../src/utils/multiTenancy/helpers';
import getMessagesForPage from '../../../../../../../src/utils/language/getMessagesForPage';
import { defaultTenant } from '../../../../../../../tenant.config';

/**
 * Shareable single-transaction link. Rather than a details-only page, it opens
 * the transactions master-detail (list + detail pane / mobile Sheet) with the
 * transaction selected, by normalizing to /profile/payments?txn={id} — the same
 * in-context view a row click produces. Keeping selection on ?txn= avoids
 * remounting (and refetching) the list. The id is read from the route on the
 * client (the auth token isn't available during static generation).
 */
const AccountPaymentTransaction: NextPageWithPaymentsLayout =
  (): ReactElement => {
    const t = useTranslations('Me');
    const router = useRouter();
    const { localizedPath } = useLocalizedPath();

    useEffect(() => {
      const id = router.query.id;
      if (typeof id === 'string' && id) {
        router.replace(
          `${localizedPath('/profile/payments')}?txn=${encodeURIComponent(id)}`
        );
      }
    }, [router.query.id, router, localizedPath]);

    return (
      <>
        <Head>
          <title>{t('payments')}</title>
        </Head>
        <div className="flex justify-center py-10 text-muted-foreground">
          <Loader2 className="size-6 animate-spin" aria-hidden />
        </div>
      </>
    );
  };

AccountPaymentTransaction.getLayout = getPaymentsLayout;

export const getStaticPaths: GetStaticPaths = async () => {
  const subDomainPaths = await constructPathsForTenantSlug();

  // The transaction id is unknowable at build time; render on demand and read
  // the id from the route on the client. A placeholder keeps the shape valid.
  const paths =
    subDomainPaths?.map((path) => {
      return {
        params: {
          slug: path.params.slug,
          id: v4(),
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
  const messages = await getMessagesForPage({
    locale: context.params?.locale as string,
    filenames: ['common', 'me', 'country'],
  });

  const tenantConfig =
    (await getTenantConfig(context.params?.slug as string)) ?? defaultTenant;

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};

export default AccountPaymentTransaction;
