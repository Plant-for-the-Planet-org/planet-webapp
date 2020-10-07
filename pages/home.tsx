import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../src/features/common/Layout';
import SalesforceHome from '../src/tenants/salesforce/Home';
import SternHome from '../src/tenants/stern/Home';
import tenantConfig from '../tenant.config';
import GetHomeMeta from '../src/utils/getMetaTags/GetHomeMeta';
import {getTenantScore} from '../src/utils/apiRequests/tenants/getTenantScore';
import {getLeaderboard} from '../src/utils/apiRequests/tenants/getLeaderboard';

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
      const newTenantScore = await getTenantScore();
      if(newTenantScore === '404'){
        router.push('/404', undefined, { shallow: true });
      }
      setTenantScore(newTenantScore);
    }
    loadTenantScore();
  }, []);

  React.useEffect(() => {
    async function loadLeaderboard() {
      const newLeaderBoard = await getLeaderboard();
      if(newLeaderBoard === '404'){
        router.push('/404', undefined, { shallow: true });
      }
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
      case 'stern':
        HomePage = SternHome;
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
          <Layout>{getHomePage()}</Layout>
      ) : (
        <></>
      )}
    </>
  );
}
