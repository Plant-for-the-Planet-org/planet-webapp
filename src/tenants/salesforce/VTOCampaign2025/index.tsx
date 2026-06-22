import Head from 'next/head';
import Footer from '../../../features/common/Layout/Footer';
import Landing from './components/Landing';
import ContentSection from './components/ContentSection';
import ImageSlideshow from './components/ImageSlideshow';
import AdditionalInfo from './components/AdditionalInfo';
import themeProperties from '../../../theme/themeProperties';
import { useTenantStore } from '../../../stores/tenantStore';

interface Props {
  tenantScore: { total: number };
  isLoaded: boolean;
}

export default function Campaign({ tenantScore, isLoaded }: Props) {
  const tenantConfig = useTenantStore((state) => state.tenantConfig);

  return (
    <>
      <Head>
        <title>{`VTO Fitness Challenge | ${tenantConfig.config.meta.title}`}</title>
      </Head>
      <main
        style={{
          backgroundColor: themeProperties.designSystem.colors.white,
          paddingBottom: '60px',
        }}
      >
        <Landing tenantScore={tenantScore} isLoaded={isLoaded} />
        <ContentSection />
        <ImageSlideshow />
        <AdditionalInfo />
        <Footer />
      </main>
    </>
  );
}
