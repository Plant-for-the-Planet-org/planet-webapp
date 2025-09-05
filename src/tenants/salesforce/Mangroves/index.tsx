import Head from 'next/head';
import Footer from '../../../features/common/Layout/Footer';
import Landing from './components/Landing';
import ContentSection from './components/ContentSection';
import ProjectGrid from './components/ProjectGrid';
import AboveFooter from './components/AboveFooter';

import BlueCarbon from './components/BlueCarbon';
import { useTenant } from '../../../features/common/Layout/TenantContext';

interface Props {
  tenantScore: { total: number };
  isLoaded: boolean;
}

export default function Campaign({ tenantScore, isLoaded }: Props) {
  const { tenantConfig } = useTenant();
  return (
    <>
      <Head>
        <title>{`Restoring Mangroves | ${tenantConfig.config.meta.title}`}</title>
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
