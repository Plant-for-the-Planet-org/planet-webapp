import type { AbstractIntlMessages } from 'next-intl';
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';

import GetHomeMeta from '../../../../src/utils/getMetaTags/GetHomeMeta';
import Mangroves from '../../../../src/tenants/salesforce/Mangroves';
import getMessagesForPage from '../../../../src/utils/language/getMessagesForPage';
import { useTenantStore } from '../../../../src/stores/tenantStore';

export default function MangrovesLandingPage() {
  const tenantScore = { total: 20000000 };

  const tenantConfig = useTenantStore((state) => state.tenantConfig);

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
  if (!tenantConfig) return <></>;

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

  return {
    props: {
      messages,
    },
  };
};
