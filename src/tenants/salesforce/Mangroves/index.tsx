import Head from 'next/head';
import Footer from '../../../features/common/Layout/Footer';
import Landing from './components/Landing';
import ContentSection from './components/ContentSection';
import ProjectGrid from './components/ProjectGrid';
import AboveFooter from './components/AboveFooter';
import React from 'react';
import tenantConfig from '../../../../tenant.config';
import BlueCarbon from './components/BlueCarbon';

const config = tenantConfig();

interface Props {
  leaderboard: {
    mostDonated: { created: string; donorName: string; treeCount: string }[];
    mostRecent: { created: string; donorName: string; treeCount: string }[];
  };
  tenantScore: { total: number };
}

export default function Campaign({ tenantScore }: Props) {
  return (
    <>
      <Head>
        <title>{`Restoring Mangroves | ${config.meta.title}`}</title>
      </Head>
      <main style={{ backgroundColor: 'white', paddingBottom: '60px' }}>
        <Landing tenantScore={tenantScore} />
        <ContentSection />
        <BlueCarbon />
        <ProjectGrid />
        <AboveFooter />
        <Footer />
      </main>
    </>
  );
}
