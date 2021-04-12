import Head from 'next/head';
import Footer from '../../../features/common/Layout/Footer';
import Landing from './components/Landing';
import LeaderBoard from './components/LeaderBoardSection';
import Timeline from './components/Timeline';
import TreeCounterSection from './components/ContentSection';
import ClimateAction from "./components/ClimateAction";
import Social from "./components/Social";
import React from "react";
import tenantConfig from '../../../../tenant.config';

const config = tenantConfig();

interface Props {
  leaderboard: any;
  tenantScore: any;
}

export default function About({ tenantScore, leaderboard }: Props) {
  return (
    <>
      <Head>
        <title>{`Home | ${config.meta.title}`}</title>
        <script
          dangerouslySetInnerHTML={{
            __html: `
                      window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
                      ga('create', 'UA-151453154-1', 'auto');
                      ga('send', 'pageview');
                    `
          }}
        />
        <script async src='https://www.google-analytics.com/analytics.js' />
        <script type="text/javascript" src="https://launchxd.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/sb53l8/b/24/a44af77267a987a660377e5c46e0fb64/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector.js?locale=en-US&collectorId=d3c90764" />
      </Head>
      <main style={{backgroundColor: 'white', paddingBottom: '60px'}}>
        <Landing tenantScore={tenantScore} />
        <TreeCounterSection />
        <LeaderBoard leaderboard={leaderboard} />
        <Timeline />
        <ClimateAction />
        <Social />
        <Footer />
      </main>
    </>
  );
}
