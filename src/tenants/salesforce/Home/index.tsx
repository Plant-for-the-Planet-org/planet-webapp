import type {
  LeaderBoardList,
  TenantScore,
} from '../../../features/common/types/leaderboard';

import Head from 'next/head';
import Footer from '../../../features/common/Layout/Footer';
import Landing from './components/Landing';
import LeaderBoard from './components/LeaderBoardSection';
import GrowingImpact from './components/GrowingImpact';
import SeaOfTrees from './components/SeaOfTrees';
import ContentSection from './components/ContentSection';
import ClimateAction from './components/ClimateAction';
import Social from './components/Social';
import React from 'react';
import { useTenant } from '../../../features/common/Layout/TenantContext';
import themeProperties from '../../../theme/themeProperties';

interface Props {
  leaderboard: LeaderBoardList | null;
  tenantScore: TenantScore | null;
}

export default function About({ tenantScore, leaderboard }: Props) {
  const { tenantConfig } = useTenant();

  return (
    <>
      <Head>
        <title>{`Home | ${tenantConfig.config.meta.title}`}</title>
      </Head>
      <main
        style={{
          backgroundColor: themeProperties.designSystem.colors.white,
          paddingBottom: '60px',
        }}
      >
        <Landing tenantScore={tenantScore} />
        <ContentSection />
        <SeaOfTrees />
        <LeaderBoard leaderboard={leaderboard} />
        <GrowingImpact />
        <ClimateAction />
        <Social />
        <Footer />
      </main>
    </>
  );
}
