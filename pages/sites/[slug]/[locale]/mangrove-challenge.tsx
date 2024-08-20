import React, { useEffect, useState } from 'react';
import SalesforceCampaign from '../../../../src/tenants/salesforce/OceanforceCampaign';
import GetHomeMeta from '../../../../src/utils/getMetaTags/GetHomeMeta';
import {
  LeaderBoard,
  TenantScore,
} from '../../../../src/features/common/types/campaign';
import { AbstractIntlMessages } from 'next-intl';
import { Tenant } from '@planet-sdk/common';
import {
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

export default function MangroveChallenge({
  pageProps: { tenantConfig },
}: Props) {
  const [leaderBoard, setLeaderBoard] = useState<LeaderBoard>({
    mostDonated: [],
    mostRecent: [],
  });
  const [tenantScore, setTenantScore] = useState<TenantScore>({ total: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const { setTenantConfig } = useTenant();

  useEffect(() => {
    if (router.isReady) {
      setTenantConfig(tenantConfig);
    }
  }, [router.isReady]);

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
        const tenantscoreRes = await fetch(
          `${process.env.WEBHOOK_URL}/oceanforce-2023`
        );
        if (tenantscoreRes.ok && tenantscoreRes.status === 200) {
          const tenantScoreArr = await tenantscoreRes.json();
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

  return (
    <>
      <GetHomeMeta />
      {tenantConfig && isLoaded ? getCampaignPage() : <></>}
    </>
  );
}

export const getStaticPaths = async () => {
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
