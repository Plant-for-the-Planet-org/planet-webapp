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
  tenantScore: { total: number };
  isLoaded: boolean;
}

export default function Campaign({ tenantScore, isLoaded }: Props) {
  return (
    <>
      <Head>
        <title>{`Restoring Mangroves | ${config.meta.title}`}</title>
      </Head>
      <main style={{ backgroundColor: 'white', paddingBottom: '60px' }}>
        <Landing tenantScore={tenantScore} isLoaded={isLoaded} />
        <ContentSection />
        <BlueCarbon />
        <ProjectGrid />
        <AboveFooter />
        <Footer />
      </main>
    </>
  );
}
