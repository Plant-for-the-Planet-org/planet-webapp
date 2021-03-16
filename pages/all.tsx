import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../src/features/common/Layout';
import LeaderBoard from '../src/tenants/planet/LeaderBoard';
import tenantConfig from '../tenant.config';
import {
  getRequest,
  getRequestWithoutRedirecting,
} from '../src/utils/apiRequests/api';
import GetLeaderboardMeta from './../src/utils/getMetaTags/GetLeaderboardMeta';
import { ErrorContext } from '../src/utils/errorContext';
import i18next from '../i18n';

const config = tenantConfig();

interface Props {
  initialized: Boolean;
}

const { useTranslation } = i18next;


export default function Home({ initialized }: Props) {
  const { t, ready } = useTranslation(['common']);
  const router = useRouter();
  const [leaderboard, setLeaderboard] = React.useState(null);
  const {
    toggleModal,
    setglobalErrorMessage,
    setglobalErrorCloseFunction,
  } = React.useContext(ErrorContext);

  const [retryDataFetching, setretryDataFetching] = React.useState('tenantScore');
  
  React.useEffect(() => {
    async function loadTenantScore() {      
      await getRequestWithoutRedirecting('/app/tenantScore')
        .then((res) => {
          setTenantScore(res);
          setretryDataFetching('leaderboard');
        })
        .catch((err) => {
          setretryDataFetching('');
          if (err) {
            setglobalErrorMessage(t('common:networkError'));
          }
          setglobalErrorCloseFunction(() => ()=>setretryDataFetching('tenantScore'));
          toggleModal(true);
        });
    }
    if (retryDataFetching === 'tenantScore') {
      loadTenantScore();
    }
  }, [retryDataFetching]);

  React.useEffect(() => {
    async function loadLeaderboard() {
      await getRequestWithoutRedirecting('/app/leaderboard')
        .then((res) => {
          setLeaderboard(res);
          setretryDataFetching('');
        })
        .catch((err) => {
          setretryDataFetching('');
          if (err) {
            setglobalErrorMessage(t('common:networkError'))
          }
          setglobalErrorCloseFunction(() => ()=>setretryDataFetching('leaderboard'));
          toggleModal(true);
        });
    }
    if (retryDataFetching === 'leaderboard') {
      loadLeaderboard();
    }
  }, [retryDataFetching]);

  const [tenantScore, setTenantScore] = React.useState(null);

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
          <Layout>{getAllPage()}</Layout>
        </>
      ) : null}
    </>
  );
}
