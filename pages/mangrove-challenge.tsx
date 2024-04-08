import React, { useEffect, useState } from 'react';
import SalesforceCampaign from '../src/tenants/salesforce/OceanforceCampaign';
import GetHomeMeta from '../src/utils/getMetaTags/GetHomeMeta';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  LeaderBoard,
  TenantScore,
} from '../src/features/common/types/campaign';

interface Props {
  initialized: boolean;
}

export default function MangroveChallenge({ initialized }: Props) {
  const [leaderBoard, setLeaderBoard] = useState<LeaderBoard>({
    mostDonated: [],
    mostRecent: [],
  });
  const [tenantScore, setTenantScore] = useState<TenantScore>({ total: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const leaderboardRes = await fetch(
          `${process.env.WEBHOOK_URL}/oceanforce-2023-leaderboard`
        );
        const leaderBoardArr = await leaderboardRes.json();
        setLeaderBoard(leaderBoardArr[0]);
      } catch (err) {
        console.error('Leaderboard could not be loaded:', err);
      }

      try {
        const tenantscoreRes = await fetch(
          `${process.env.WEBHOOK_URL}/oceanforce-2023`
        );
        const tenantScoreArr = await tenantscoreRes.json();
        setTenantScore(tenantScoreArr[0]);
        setIsLoaded(true);
      } catch (err) {
        console.error('Treecount could not be loaded:', err);
      }

      setIsLoaded(true);
    }

    loadData();
  }, []);

  function getCampaignPage() {
    let CampaignPage;
    switch (process.env.TENANT) {
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

  return (
    <>
      <GetHomeMeta />
      {initialized ? getCampaignPage() : <></>}
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(
        locale,
        ['donate', 'common', 'country', 'manageProjects', 'leaderboard'],
        null,
        ['en']
      )),
    },
  };
}
