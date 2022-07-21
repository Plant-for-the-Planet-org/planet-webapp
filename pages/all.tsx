import React, { useContext } from 'react';
import LeaderBoard from '../src/tenants/planet/LeaderBoard';
import tenantConfig from '../tenant.config';
import { getRequest } from '../src/utils/apiRequests/api';
import GetLeaderboardMeta from './../src/utils/getMetaTags/GetLeaderboardMeta';
import { TenantContext } from '../src/features/common/Layout/TenantContext';
import { ErrorHandlingContext } from '../src/features/common/Layout/ErrorHandlingContext';
const config = tenantConfig();

interface Props {
  initialized: Boolean;
}

export default function Home({ initialized }: Props) {
  const { tenantID } = useContext(TenantContext);
  const [leaderboard, setLeaderboard] = React.useState(null);
  const { handleError } = React.useContext(ErrorHandlingContext);

  React.useEffect(() => {
    async function loadLeaderboard() {
      const newLeaderboard = await getRequest(
        `/app/leaderboard/${tenantID}`,
        handleError,
        '/'
        tenantID
      );
      setLeaderboard(newLeaderboard);
    }
    loadLeaderboard();
  }, []);

  const [tenantScore, setTenantScore] = React.useState(null);

  React.useEffect(() => {
    async function loadTenantScore() {
      const newTenantScore = await getRequest(
        `/app/tenantScore/${tenantID}`,
        handleError,
        '/',
        tenantID
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
