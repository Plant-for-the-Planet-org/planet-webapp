import React, { useEffect, useState } from 'react';
import SalesforceCampaign from '../src/tenants/salesforce/VTOCampaign';
import GetHomeMeta from '../src/utils/getMetaTags/GetHomeMeta';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  LeaderBoard,
  TenantScore,
} from '../src/features/common/types/campaign';

interface Props {
  initialized: boolean;
}

export default function VTOFitnessChallenge({ initialized }: Props) {
  const [leaderBoard, setLeaderBoard] = useState<LeaderBoard>({
    mostDonated: [],
    mostRecent: [],
  });
  const [tenantScore, setTenantScore] = useState<TenantScore>({
    total: 0,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const leaderboardRes = await fetch(
          `${process.env.WEBHOOK_URL}/salesforce-vto-2024-leaderboard`
        );
        const leaderBoardArr = await leaderboardRes.json();
        setLeaderBoard(leaderBoardArr[0]);
      } catch (err) {
        console.error('Leaderboard could not be loaded:', err);
      }

      try {
        const tenantscoreRes = await fetch(
          `${process.env.WEBHOOK_URL}/salesforce-vto-2024-treecount`
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
    if (leaderBoard === null || tenantScore === null) return <></>;
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
      {initialized && isLoaded ? getCampaignPage() : <></>}
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(
        locale,
        [
          'bulkCodes',
          'common',
          'country',
          'donate',
          'donationLink',
          'editProfile',
          'giftfunds',
          'leaderboard',
          'managePayouts',
          'manageProjects',
          'maps',
          'me',
          'planet',
          'planetcash',
          'redeem',
          'registerTrees',
          'tenants',
          'treemapper',
        ],
        null,
        ['en']
      )),
    },
  };
}
