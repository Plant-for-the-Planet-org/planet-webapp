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
