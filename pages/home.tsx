import { useRouter } from 'next/router';
import React from 'react';
import SalesforceHome from '../src/tenants/salesforce/Home';
import SternHome from '../src/tenants/stern/Home';
import LacoquetaHome from '../src/tenants/lacoqueta/Home';
import NitroSBHome from '../src/tenants/nitrosb/Home';
import tenantConfig from '../tenant.config';
import GetHomeMeta from '../src/utils/getMetaTags/GetHomeMeta';
import { getRequest } from '../src/utils/apiRequests/api';

const config = tenantConfig();

interface Props {
  initialized: Boolean;
}

export default function Home(initialized: Props) {
  const router = useRouter();

  const [leaderboard, setLeaderboard] = React.useState(null);
  const [tenantScore, setTenantScore] = React.useState(null);

  React.useEffect(() => {
    async function loadTenantScore() {
      const newTenantScore = await getRequest(`/app/tenantScore`);
      setTenantScore(newTenantScore);
    }
    loadTenantScore();
  }, []);

  React.useEffect(() => {
    async function loadLeaderboard() {
      const newLeaderBoard = await getRequest(`/app/leaderboard`);
      setLeaderboard(newLeaderBoard);
    }
    loadLeaderboard();
  }, []);

  if (!config.header.items[0].visible) {
    if (typeof window !== 'undefined') {
      router.push('/');
    }
  }

  let HomePage;
  function getHomePage() {
    switch (process.env.TENANT) {
      case 'salesforce':
        HomePage = SalesforceHome;
        return <HomePage leaderboard={leaderboard} tenantScore={tenantScore} />;
      case 'lacoqueta':
        HomePage = LacoquetaHome;
        return <HomePage leaderboard={leaderboard} tenantScore={tenantScore} />;
      case 'stern':
        HomePage = SternHome;
        return <HomePage leaderboard={leaderboard} tenantScore={tenantScore} />;
      case 'nitrosb':
        HomePage = NitroSBHome;
        return <HomePage leaderboard={leaderboard} tenantScore={tenantScore} />;
      default:
        HomePage = null;
        return HomePage;
    }
  }

  return (
    <>
      <GetHomeMeta/>
      {initialized ? (
          getHomePage()
      ) : (
        <></>
      )}
    </>
  );
}
