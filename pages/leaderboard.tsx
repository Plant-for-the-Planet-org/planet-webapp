import { useRouter } from 'next/router';
import React from 'react';
import {
  PullDownContent,
  PullToRefresh,
  RefreshContent,
  ReleaseContent,
} from 'react-js-pull-to-refresh';
import Layout from '../src/features/common/Layout';
import About from '../src/tenants/planet/About/About';
import SalesforceLeaderBoard from '../src/tenants/salesforce/Home';
import SternLeaderBoard from '../src/tenants/stern/Home';

import Head from 'next/head';
import tenantConfig from '../tenant.config';
const config = tenantConfig();

export default function LeaderBoard() {
  const router = useRouter();
  // stores whether device is mobile or not;
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  React.useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

  const [leaderboard, setLeaderboard] = React.useState(null);
  const [tenantScore, setTenantScore] = React.useState(null);
  React.useEffect(() => {
    async function loadTenantScore() {
      await fetch(`${process.env.API_ENDPOINT}/app/tenantScore`, {
        headers: { 'tenant-key': `${process.env.TENANTID}` },
      }).then(async (res) => {
        const newTenantScore = res.status === 200 ? await res.json() : null;
        if (res.status !== 200) {
          router.push('/404', undefined, { shallow: true });
        }
        setTenantScore(newTenantScore);
      });
    }
    loadTenantScore();
  }, []);

  React.useEffect(() => {
    async function loadLeaderboard() {
      await fetch(`${process.env.API_ENDPOINT}/app/leaderboard`, {
        headers: { 'tenant-key': `${process.env.TENANTID}` },
      }).then(async (res) => {
        const newLeaderboard = res.status === 200 ? await res.json() : null;
        if (res.status !== 200) {
          router.push('/404', undefined, { shallow: true });
        }
        setLeaderboard(newLeaderboard);
      });
    }
    loadLeaderboard();
  }, []);

  function onRefresh() {
    return new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
  }
  return (
    <>
      <Head>
        <title>{`${config.meta.title} - Leaderboard`}</title>
        <meta property="og:site_name" content={config.meta.title} />
        <meta property="og:locale" content="en_US" />
        <meta
          property="og:url"
          content={`${process.env.SCHEME}://${config.tenantURL}`}
        />
        <meta
          property="og:title"
          content={`${config.meta.title} - Leaderboard`}
        />
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
      <PullToRefresh
        pullDownContent={<PullDownContent />}
        releaseContent={<ReleaseContent />}
        refreshContent={<RefreshContent />}
        pullDownThreshold={150}
        onRefresh={onRefresh}
        triggerHeight={isMobile ? 150 : 0}
        backgroundColor="white"
        startInvisible
      >
        <Layout>
          {process.env.TENANT === 'stern' ? (
            <SternLeaderBoard tenantScore={tenantScore} leaderboard={leaderboard} />
          ) : (
            <SalesforceLeaderBoard
              leaderboard={leaderboard}
              tenantScore={tenantScore}
            />
          )}
        </Layout>
      </PullToRefresh>
    </>
  );
}
