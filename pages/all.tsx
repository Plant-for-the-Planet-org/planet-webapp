import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../src/features/common/Layout';
import LeaderBoard from '../src/tenants/planet/LeaderBoard';
import tenantConfig from '../tenant.config';
import { getRequest } from '../src/utils/apiRequests/api';
import NetworkFailure from '../src/features/common/ErrorComponents/NetworkFailure';
import GetLeaderboardMeta from '../src/utils/getMetaTags/GetLeaderboardMeta';

const config = tenantConfig();

export default function Home() {
  const router = useRouter();
  const [network, setNetwork] = React.useState(false);

  const [leaderboard, setLeaderboard] = React.useState(null);
  console.log(leaderboard);

  React.useEffect(() => {
    async function loadLeaderboard() {
      const newLeaderboard = await getRequest('/app/leaderboard').then((data) => {
        setLeaderboard(data);
        setNetwork(false);
      }).catch((err) => {
        setNetwork(true);
      });
    }
    loadLeaderboard();
  }, []);

  const handleNetwork = () => {
    setNetwork(!network);
  };

  let AllPage;
  function getAllPage() {
    switch (process.env.TENANT) {
      case 'planet':
        AllPage = <LeaderBoard leaderboard={leaderboard} />;
        return AllPage;
      default:
        AllPage = null;
        return AllPage;
    }
  }

  return (
    <>
      <GetLeaderboardMeta />
      <Layout>
        {getAllPage()}
        {network && (
          <div
            style={{ position: 'fixed', bottom: 0, left: 0 }}
          >
            <NetworkFailure refresh handleNetwork={handleNetwork} />
          </div>
        )}
      </Layout>
    </>
  );
}
