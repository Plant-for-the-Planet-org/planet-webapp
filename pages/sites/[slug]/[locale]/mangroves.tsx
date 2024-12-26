import React, { useEffect } from 'react';
import Mangroves from '../../../../src/tenants/salesforce/Mangroves';
import GetHomeMeta from '../../../../src/utils/getMetaTags/GetHomeMeta';
import { AbstractIntlMessages } from 'next-intl';
import { Tenant } from '@planet-sdk/common';
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import { getTenantConfig } from '../../../../src/utils/multiTenancy/helpers';
import { defaultTenant } from '../../../../tenant.config';
import getMessagesForPage from '../../../../src/utils/language/getMessagesForPage';
import { useTenant } from '../../../../src/features/common/Layout/TenantContext';
import router from 'next/router';

interface Props {
  pageProps: PageProps;
}

export default function MangrovesLandingPage({
  pageProps: { tenantConfig },
}: Props) {
  const tenantScore = { total: 16000000 };

  const { setTenantConfig } = useTenant();

  useEffect(() => {
    if (router.isReady) {
      setTenantConfig(tenantConfig);
    }
  }, [router.isReady]);

  function getCampaignPage() {
    let CampaignPage;
    switch (tenantConfig.config.slug) {
      case 'salesforce':
        return <Mangroves tenantScore={tenantScore} isLoaded={true} />;
      default:
        CampaignPage = null;
        return CampaignPage;
    }
  }

  return (
    <>
      <GetHomeMeta />
      {tenantConfig ? getCampaignPage() : <></>}
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [{ params: { slug: 'salesforce', locale: 'en' } }],
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
    filenames: ['common', 'donate', 'country', 'manageProjects', 'leaderboard'],
  });

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};
