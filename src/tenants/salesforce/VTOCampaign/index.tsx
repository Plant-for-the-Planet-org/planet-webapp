import Head from 'next/head';
import Footer from '../../../features/common/Layout/Footer';
import Landing from './components/Landing';
import ContentSection from './components/ContentSection';
import ProjectGrid from './components/ProjectGrid';
import LeaderBoard from './components/LeaderBoardSection';
import AdditionalInfo from './components/AdditionalInfo';
import React from 'react';
import tenantConfig from '../../../../tenant.config';

const config = tenantConfig();

interface Props {
  leaderboard: {
    mostDonated: { created: string; donorName: string; treeCount: string }[];
    mostRecent: { created: string; donorName: string; treeCount: string }[];
  };
  tenantScore: { total: number };
  isLoaded: boolean;
}

export default function Campaign({
  tenantScore,
  leaderboard,
  isLoaded,
}: Props) {
  return (
    <>
      <Head>
        <title>{`VTO Fitness Challenge | ${config.meta.title}`}</title>
      </Head>
      <main style={{ backgroundColor: 'white', paddingBottom: '60px' }}>
        <Landing tenantScore={tenantScore} isLoaded={isLoaded} />
        <ContentSection />
        <ProjectGrid />
        <LeaderBoard leaderboard={leaderboard} isLoaded={isLoaded} />
        <AdditionalInfo />
        <Footer />
      </main>
    </>
  );
}
