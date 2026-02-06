import Head from 'next/head';
import Footer from '../../../features/common/Layout/Footer';
import Landing from './components/Landing';
import ContentSection from './components/ContentSection';
import ProjectGrid from './components/ProjectGrid';
import AboveFooter from './components/AboveFooter';

import BlueCarbon from './components/BlueCarbon';
import themeProperties from '../../../theme/themeProperties';
import { useTenantStore } from '../../../stores/tenantStore';

interface Props {
  tenantScore: { total: number };
  isLoaded: boolean;
}

export default function Campaign({ tenantScore, isLoaded }: Props) {
  // store: state
  const tenantConfig = useTenantStore((state) => state.tenantConfig);
  return (
    <>
      <Head>
        <title>{`Restoring Mangroves | ${tenantConfig.config.meta.title}`}</title>
      </Head>
      <main
        style={{
          backgroundColor: themeProperties.designSystem.colors.white,
          paddingBottom: '60px',
        }}
      >
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
