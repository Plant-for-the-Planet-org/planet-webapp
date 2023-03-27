import { useRouter } from 'next/router';
import React from 'react';
import SalesforceCampaign from '../src/tenants/salesforce/Campaign';
import tenantConfig from '../tenant.config';
import GetHomeMeta from '../src/utils/getMetaTags/GetHomeMeta';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

interface Props {
  initialized: boolean;
  pageProps: {
    campaignLeaderBoard: {
      mostDonated: { created: string; donorName: string; treeCount: string }[];
      mostRecent: { created: string; donorName: string; treeCount: string }[];
    };
    campaignTenantScore: { total: number };
  };
}

export default function VTOFitnessChallenge({ initialized, pageProps }: Props) {
  const router = useRouter();
  const config = tenantConfig();

  if (!config.header.items['home'].visible) {
    if (typeof window !== 'undefined') {
      router.push('/');
    }
  }

  function getCampaignPage() {
    let CampaignPage;
    switch (process.env.TENANT) {
      case 'salesforce':
        CampaignPage = SalesforceCampaign;
        return (
          <CampaignPage
            leaderboard={pageProps.campaignLeaderBoard}
            tenantScore={pageProps.campaignTenantScore}
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

export async function getStaticProps({ locale }) {
  let campaignLeaderBoard = { mostDonated: [], mostRecent: [] };
  let campaignTenantScore = { total: 0 };

  try {
    const leaderboardRes = await fetch(
      `${process.env.NEXT_PUBLIC_WEBHOOK_URL}/salesforce-earth-month-leaderboard`
    );
    const leaderBoardArr = await leaderboardRes.json();
    campaignLeaderBoard = leaderBoardArr[0];
  } catch (err) {
    console.log(err);
  }

  try {
    const tenantscoreRes = await fetch(
      `${process.env.NEXT_PUBLIC_WEBHOOK_URL}/salesforce-earth-month-count`
    );
    const tenantScoreArr = await tenantscoreRes.json();
    campaignTenantScore = tenantScoreArr[0];
  } catch (err) {
    console.log(err);
  }

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
        ['en', 'de', 'fr', 'es', 'it', 'pt-BR', 'cs']
      )),
      campaignLeaderBoard,
      campaignTenantScore,
    },
    revalidate: 600,
  };
}
