import type { AbstractIntlMessages } from 'next-intl';
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import type { Tenant } from '@planet-sdk/common';

import { getTenantConfig } from '../../../../src/utils/multiTenancy/helpers';
import { defaultTenant } from '../../../../tenant.config';
import GetHomeMeta from '../../../../src/utils/getMetaTags/GetHomeMeta';
import Mangroves from '../../../../src/tenants/salesforce/Mangroves';
import getMessagesForPage from '../../../../src/utils/language/getMessagesForPage';
import { useTenantStore } from '../../../../src/stores/tenantStore';

export default function MangrovesLandingPage() {
  const tenantScore = { total: 20000000 };
  //store: state
  const storedTenantSlug = useTenantStore(
    (state) => state.tenantConfig.config.slug
  );
  const isInitialized = useTenantStore((state) => state.isInitialized);

  function getCampaignPage() {
    let CampaignPage;
    switch (storedTenantSlug) {
      case 'salesforce':
        return <Mangroves tenantScore={tenantScore} isLoaded={true} />;
      default:
        CampaignPage = null;
        return CampaignPage;
    }
  }
  if (!isInitialized) return <></>;

  return (
    <>
      <GetHomeMeta />
      {getCampaignPage()}
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
  const messages = await getMessagesForPage({
    locale: context.params?.locale as string,
    filenames: [
      'common',
      'donate',
      'country',
      'manageProjects',
      'leaderboard',
      'allProjects',
      'projectDetails',
      'project',
    ],
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
