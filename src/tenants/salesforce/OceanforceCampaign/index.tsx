import Head from 'next/head';
import Footer from '../../../features/common/Layout/Footer';
import Landing from './components/Landing';
import ContentSection from './components/ContentSection';
import LeaderBoard from './components/LeaderBoardSection';
import ParticipationSection from './components/ParticipationSection';
import AdditionalContent from './components/AdditionalContent';
import { useTenant } from '../../../features/common/Layout/TenantContext';
import themeProperties from '../../../theme/themeProperties';

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
  const { tenantConfig } = useTenant();
  return (
    <>
      <Head>
        <title>{`Mangrove Challenge | ${tenantConfig.config.meta.title}`}</title>
      </Head>
      <main
        style={{
          backgroundColor: themeProperties.designSystem.colors.white,
          paddingBottom: '60px',
        }}
      >
        <Landing tenantScore={tenantScore} isLoaded={isLoaded} />
        <ContentSection />
        <ParticipationSection />
        <LeaderBoard leaderboard={leaderboard} isLoaded={isLoaded} />
        <AdditionalContent />
        <Footer />
      </main>
    </>
  );
}
