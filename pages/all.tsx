import { useRouter } from 'next/router';
import React from 'react';
import LeaderBoard from '../src/tenants/planet/LeaderBoard';
import tenantConfig from '../tenant.config';
import { getRequest } from '../src/utils/apiRequests/api';
import GetLeaderboardMeta from './../src/utils/getMetaTags/GetLeaderboardMeta';
import { ParamsContext } from '../src/features/common/Layout/QueryParamsContext';
import { ErrorHandlingContext } from '../src/features/common/Layout/ErrorHandlingContext';
import { getTenantID } from '../src/utils/apiRequests/compareTenanID';
const config = tenantConfig();

interface Props {
  initialized: Boolean;
}

export default function Home({ initialized }: Props) {
  const router = useRouter();
  const [leaderboard, setLeaderboard] = React.useState(null);
  const { tenantID } = React.useContext(ParamsContext);
  const { handleError } = React.useContext(ErrorHandlingContext);

  const resultantTenantID = getTenantID(tenantID);
  React.useEffect(() => {
    async function loadLeaderboard() {
      const newLeaderboard = await getRequest(
        tenantID,
        `/app/leaderboard/${resultantTenantID}`,
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
        tenantID,
        `/app/tenantScore/${resultantTenantID}`,
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
