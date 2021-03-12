import { useRouter } from 'next/router';
import React from 'react';
import SalesforceHome from '../src/tenants/salesforce/Home';
import SternHome from '../src/tenants/stern/Home';
import BasicHome from '../src/tenants/common/Home';
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

  if (!config.header.items['home'].visible) {
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
      case 'stern':
        HomePage = SternHome;
        return <HomePage leaderboard={leaderboard} tenantScore={tenantScore} />;
      case 'nitrosb':
      case 'energizer':
      case 'senatDerWirtschaft':
      case 'pampers':
      case 'interactClub':
      case 'culchacandela':
      case 'xiting':
      case 'lacoqueta':
        HomePage = BasicHome;
        return <HomePage leaderboard={leaderboard} tenantScore={tenantScore} />;
      default:
        HomePage = null;
        return HomePage;
    }
  }

  return (
    <>
      <GetHomeMeta />
      {initialized ? (
        getHomePage()
      ) : (
          <></>
        )}
    </>
  );
}
