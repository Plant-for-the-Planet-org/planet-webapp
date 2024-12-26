import React, { ReactElement } from 'react';
import UserLayout from '../../../../../../../src/features/common/Layout/UserLayout/UserLayout';
import Head from 'next/head';
import ManagePayouts, {
  ManagePayoutTabs,
} from '../../../../../../../src/features/user/ManagePayouts';
import { AbstractIntlMessages, useTranslations } from 'next-intl';
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../../../src/utils/multiTenancy/helpers';
import { v4 } from 'uuid';
import { Tenant } from '@planet-sdk/common/build/types/tenant';
import { defaultTenant } from '../../../../../../../tenant.config';
import { useRouter } from 'next/router';
import { useTenant } from '../../../../../../../src/features/common/Layout/TenantContext';
import getMessagesForPage from '../../../../../../../src/utils/language/getMessagesForPage';

interface Props {
  pageProps: PageProps;
}

export default function EditBankDetailsPage({
  pageProps: { tenantConfig },
}: Props): ReactElement {
  const t = useTranslations('Me');
  const router = useRouter();
  const { setTenantConfig } = useTenant();

  React.useEffect(() => {
    if (router.isReady) {
      setTenantConfig(tenantConfig);
    }
  }, [router.isReady]);

  return tenantConfig ? (
    <UserLayout>
      <Head>
        <title>{t('managePayouts.titleEditBankDetails')}</title>
      </Head>
      <ManagePayouts step={ManagePayoutTabs.OVERVIEW} isEdit={true} />
    </UserLayout>
  ) : (
    <></>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const subDomainPaths = await constructPathsForTenantSlug();

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
    paths: paths,
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
    filenames: ['common', 'me', 'country', 'managePayouts'],
  });

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};
