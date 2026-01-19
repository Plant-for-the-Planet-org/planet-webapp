import type {
  LeaderBoard,
  TenantScore,
} from '../../../../src/features/common/types/campaign';
import type { AbstractIntlMessages } from 'next-intl';
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';

import { useEffect, useState } from 'react';
import SalesforceCampaign from '../../../../src/tenants/salesforce/VTOCampaign2025';
import GetHomeMeta from '../../../../src/utils/getMetaTags/GetHomeMeta';
import getMessagesForPage from '../../../../src/utils/language/getMessagesForPage';
import { useTenantStore } from '../../../../src/stores/tenantStore';

export default function VTOFitnessChallenge() {
  // local state
  const [leaderBoard, setLeaderBoard] = useState<LeaderBoard>({
    mostDonated: [],
    mostRecent: [],
  });
  const [tenantScore, setTenantScore] = useState<TenantScore>({
    total: 0,
  });
  const [isLoaded, setIsLoaded] = useState(false);
  // store: action
  const tenantConfig = useTenantStore((state) => state.tenantConfig);

  useEffect(() => {
    async function loadData() {
      try {
        const leaderboardRes = await fetch(
          `${process.env.WEBHOOK_URL}/salesforce-vto-2025-leaderboard`
        );
        if (leaderboardRes.ok && leaderboardRes.status === 200) {
          const leaderBoardArr = await leaderboardRes.json();
          setLeaderBoard(leaderBoardArr[0]);
        }
      } catch (err) {
        console.error('Leaderboard could not be loaded:', err);
      }

      try {
        const tenantScoreRes = await fetch(
          `${process.env.WEBHOOK_URL}/salesforce-vto-2025-treecount`
        );
        if (tenantScoreRes.ok && tenantScoreRes.status === 200) {
          const tenantScoreArr = await tenantScoreRes.json();
          setTenantScore(tenantScoreArr[0]);
          setIsLoaded(true);
        }
      } catch (err) {
        console.error('Treecount could not be loaded:', err);
      }

      setIsLoaded(true);
    }

    loadData();
  }, []);

  function getCampaignPage() {
    if (leaderBoard === null || tenantScore === null) return <></>;
    let CampaignPage;
    switch (tenantConfig.config.slug) {
      case 'salesforce':
        CampaignPage = SalesforceCampaign;
        return (
          <CampaignPage
            leaderboard={leaderBoard}
            tenantScore={tenantScore}
            isLoaded={isLoaded}
          />
        );
      default:
        CampaignPage = null;
        return CampaignPage;
    }
  }
  if (!isLoaded || !tenantConfig) return <></>;

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
      'projectDetails',
      'allProjects',
      'project',
    ],
  });

  return {
    props: {
      messages,
    },
  };
};
