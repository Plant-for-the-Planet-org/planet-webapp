import { useRouter } from 'next/router';
import React from 'react';
import SalesforceCampaign from '../src/tenants/salesforce/Campaign';
import tenantConfig from '../tenant.config';
import GetHomeMeta from '../src/utils/getMetaTags/GetHomeMeta';
import { getRequest } from '../src/utils/apiRequests/api';
import { ErrorHandlingContext } from '../src/features/common/Layout/ErrorHandlingContext';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

interface Props {
  initialized: Boolean;
}

export default function VTOFitnessChallenge(initialized: Props) {
  const router = useRouter();
  const config = tenantConfig();
  const [leaderboard, setLeaderboard] = React.useState(null);
  const [tenantScore, setTenantScore] = React.useState(null);
  const { handleError } = React.useContext(ErrorHandlingContext);

  React.useEffect(() => {
    async function loadTenantScore() {
      const newTenantScore = await getRequest(
        `/app/tenantScore`,
        handleError,
        '/'
      );
      setTenantScore(newTenantScore);
    }
    loadTenantScore();
  }, []);

  React.useEffect(() => {
    async function loadLeaderboard() {
      const newLeaderBoard = await getRequest(
        `/app/leaderboard`,
        handleError,
        '/'
      );
      setLeaderboard(newLeaderBoard);
    }
    loadLeaderboard();
  }, []);

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
          <CampaignPage leaderboard={leaderboard} tenantScore={tenantScore} />
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
