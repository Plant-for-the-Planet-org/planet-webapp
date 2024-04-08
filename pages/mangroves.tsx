import React, { useEffect, useState } from 'react';
import Mangroves from '../src/tenants/salesforce/Mangroves';
import GetHomeMeta from '../src/utils/getMetaTags/GetHomeMeta';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { TenantScore } from '../src/features/common/types/campaign';

interface Props {
  initialized: boolean;
}

export default function MangrovesLandingPage({ initialized }: Props) {
  const [tenantScore, setTenantScore] = useState<TenantScore>({
    total: 0,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const tenantscoreRes = await fetch(
          `${process.env.WEBHOOK_URL}/sf-mangroves-treecount`
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
    if (tenantScore === null) return <></>;
    let CampaignPage;
    switch (process.env.TENANT) {
      case 'salesforce':
        return <Mangroves tenantScore={tenantScore} isLoaded={isLoaded} />;
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
        ['en', 'de', 'fr', 'es', 'it', 'pt-BR', 'cs']
      )),
    },
  };
}
