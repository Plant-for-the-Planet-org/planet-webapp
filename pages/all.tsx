import { useRouter } from 'next/router';
import React from 'react';
import Head from 'next/head';
import Layout from '../src/features/common/Layout';
import LeaderBoard from '../src/tenants/planet/LeaderBoard'
import tenantConfig from '../tenant.config';
import { getRequest } from '../src/utils/apiRequests/api';

const config = tenantConfig();

export default function Home() {
  const router = useRouter();
  // stores whether device is mobile or not;
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  React.useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

  const [leaderboard, setLeaderboard] = React.useState(null);
  console.log(leaderboard);

  React.useEffect(() => {
    async function loadLeaderboard() {
      const newLeaderboard = await getRequest('/app/leaderboard');
      setLeaderboard(newLeaderboard);
    }
    loadLeaderboard();
  }, []);

  function onRefresh() {
    return new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
  }

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
      <Head>
        <title>{`Home | ${config.meta.title}`}</title>
        <meta property="og:site_name" content={config.meta.title} />
        <meta
          property="og:url"
          content={`${process.env.SCHEME}://${config.tenantURL}`}
        />
        <meta property="og:title" content={`Home | ${config.meta.title}`} />
        <meta property="og:description" content={config.meta.description} />
        <meta name="description" content={config.meta.description} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={config.meta.image} />
        {config.tenantName === 'planet' ? (
          <link rel="alternate" href="android-app://org.pftp/projects" />
        ) : null}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={config.meta.title} />
        <meta name="twitter:site" content={config.meta.twitterHandle} />
        <meta name="twitter:url" content={config.tenantURL} />
        <meta name="twitter:description" content={config.meta.description} />
      </Head>

      <Layout>{getAllPage()}</Layout>
    </>
  );
}
