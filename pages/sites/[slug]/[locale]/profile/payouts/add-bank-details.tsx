import type { ReactElement } from 'react';
import type { AbstractIntlMessages } from 'next-intl';
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import type { Tenant } from '@planet-sdk/common';

import UserLayout from '../../../../../../src/features/common/Layout/UserLayout/UserLayout';
import Head from 'next/head';
import ManagePayouts, {
  ManagePayoutTabs,
} from '../../../../../../src/features/user/ManagePayouts';
import { useTranslations } from 'next-intl';
import { useUserProps } from '../../../../../../src/features/common/Layout/UserPropsContext';
import AccessDeniedLoader from '../../../../../../src/features/common/ContentLoaders/Projects/AccessDeniedLoader';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../../src/utils/multiTenancy/helpers';
import getMessagesForPage from '../../../../../../src/utils/language/getMessagesForPage';
import { useTenantStore } from '../../../../../../src/stores/tenantStore';
import { defaultTenant } from '../../../../../../tenant.config';

export default function AddBankDetailsPage(): ReactElement {
  const t = useTranslations('Me');
  const { user } = useUserProps();

  //store: state
  const isInitialized = useTenantStore((state) => state.isInitialized);
  if (!isInitialized) return <></>;

  return (
    <UserLayout>
      <Head>
        <title>{t('managePayouts.titleAddBankDetails')}</title>
      </Head>
      {user?.type === 'tpo' ? (
        <ManagePayouts step={ManagePayoutTabs.ADD_BANK_DETAILS} />
      ) : (
        <AccessDeniedLoader />
      )}
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
  tenantConfig: Tenant;
}

export const getStaticProps: GetStaticProps<PageProps> = async (
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<PageProps>> => {
  const messages = await getMessagesForPage({
    locale: context.params?.locale as string,
    filenames: ['common', 'me', 'country', 'managePayouts'],
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
