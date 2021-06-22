import { useRouter } from 'next/router';
import React from 'react';
import SalesforceHome from '../src/tenants/salesforce/Home';
import SateinsHome from '../src/tenants/sateins/Home';

import SternHome from '../src/tenants/stern/Home';
import BasicHome from '../src/tenants/common/Home';
import tenantConfig from '../tenant.config';
import GetHomeMeta from '../src/utils/getMetaTags/GetHomeMeta';
import { getRequest, getRequestWithoutRedirecting } from '../src/utils/apiRequests/api';

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
      await getRequestWithoutRedirecting(`/app/tenantScore/${process.env.TENANTID}`).then((res)=>{
        setTenantScore(res);
      }).catch((err)=>{
        console.log('Error',err);
      });
    }
    loadTenantScore();
  }, []);

  React.useEffect(() => {
    async function loadLeaderboard() {
      await getRequestWithoutRedirecting(`/app/leaderboard/${process.env.TENANTID}?limit=20`).then((res)=>{
        setLeaderboard(res);
      }).catch((err)=>{
        console.log('Error',err);
      });
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
      case 'sateins':
        HomePage = SateinsHome;
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
      case 'ulmpflanzt':
      case 'sitex':
      case '3pleset':
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
      {initialized ? getHomePage() : <></>}
    </>
  );
}
