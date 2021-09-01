import Head from 'next/head';
import Footer from '../../../features/common/Layout/Footer';
import Landing from './components/Landing';
import LeaderBoard from './components/LeaderBoardSection';
import GrowingImpact from './components/GrowingImpact';
import SeaOfTrees from './components/SeaOfTrees';
import ContentSection from './components/ContentSection';
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
      <main style={{ backgroundColor: 'white', paddingBottom: '60px' }}>
        <Landing tenantScore={tenantScore} />
        <ContentSection />
        {/* <SeaOfTrees /> */}
        <LeaderBoard leaderboard={leaderboard} />
        <GrowingImpact />
        <ClimateAction />
        <Social />
        <Footer />
      </main>
    </>
  );
}
