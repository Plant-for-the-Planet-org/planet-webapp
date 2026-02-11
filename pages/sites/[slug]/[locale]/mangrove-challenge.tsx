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
import type { Tenant } from '@planet-sdk/common';

import { getTenantConfig } from '../../../../src/utils/multiTenancy/helpers';
import { defaultTenant } from '../../../../tenant.config';
import { useEffect, useState } from 'react';
import SalesforceCampaign from '../../../../src/tenants/salesforce/OceanforceCampaign';
import GetHomeMeta from '../../../../src/utils/getMetaTags/GetHomeMeta';
import getMessagesForPage from '../../../../src/utils/language/getMessagesForPage';
import { useTenantStore } from '../../../../src/stores/tenantStore';

export default function MangroveChallenge() {
  // local state
  const [leaderBoard, setLeaderBoard] = useState<LeaderBoard>({
    mostDonated: [],
    mostRecent: [],
  });
  const [tenantScore, setTenantScore] = useState<TenantScore>({ total: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  // store: state
  const storedTenantSlug = useTenantStore(
    (state) => state.tenantConfig.config.slug
  );
  const isInitialized = useTenantStore((state) => state.isInitialized);

  useEffect(() => {
    async function loadData() {
      try {
        const leaderboardRes = await fetch(
          `${process.env.WEBHOOK_URL}/oceanforce-2023-leaderboard`
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
          `${process.env.WEBHOOK_URL}/oceanforce-2023`
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
    let CampaignPage;
    switch (storedTenantSlug) {
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
  if (!isInitialized || !isLoaded) return <></>;
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
