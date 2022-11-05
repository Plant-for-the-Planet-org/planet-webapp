import React from 'react';
import LeaderBoard from '../src/tenants/planet/LeaderBoard';
import { getRequest } from '../src/utils/apiRequests/api';
import GetLeaderboardMeta from './../src/utils/getMetaTags/GetLeaderboardMeta';
import { TENANT_ID } from '../src/utils/constants/environment';
import { ErrorHandlingContext } from '../src/features/common/Layout/ErrorHandlingContext';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

interface Props {
  initialized: Boolean;
}

export default function Home({ initialized }: Props) {
  const [leaderboard, setLeaderboard] = React.useState(null);
  const { handleError } = React.useContext(ErrorHandlingContext);

  React.useEffect(() => {
    async function loadLeaderboard() {
      const newLeaderboard = await getRequest(
        `/app/leaderboard/${TENANT_ID}`,
        handleError,
        '/'
      );
      setLeaderboard(newLeaderboard);
    }
    loadLeaderboard();
  }, []);

  const [tenantScore, setTenantScore] = React.useState(null);

  React.useEffect(() => {
    async function loadTenantScore() {
      const newTenantScore = await getRequest(
        `/app/tenantScore/${TENANT_ID}`,
        handleError,
        '/'
      );
      setTenantScore(newTenantScore);
    }
    loadTenantScore();
  }, []);

  let AllPage;
  function getAllPage() {
    switch (process.env.TENANT) {
      case 'planet':
        AllPage = (
          <LeaderBoard leaderboard={leaderboard} tenantScore={tenantScore} />
        );
        return AllPage;
      case 'ttc':
        AllPage = (
          <LeaderBoard leaderboard={leaderboard} tenantScore={tenantScore} />
        );
        return AllPage;
      default:
        AllPage = null;
        return AllPage;
    }
  }

  return (
    <>
      {initialized ? (
        <>
          <GetLeaderboardMeta />
          {getAllPage()}
        </>
      ) : null}
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
