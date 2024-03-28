import Head from 'next/head';
import Footer from '../../../features/common/Layout/Footer';
import Landing from './components/Landing';
import ContentSection from './components/ContentSection';
import LeaderBoard from './components/LeaderBoardSection';
import tenantConfig from '../../../../tenant.config';
import ParticipationSection from './components/ParticipationSection';
import AdditionalContent from './components/AdditionalContent';

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
        <title>{`Mangrove Challenge | ${config.meta.title}`}</title>
      </Head>
      <main style={{ backgroundColor: 'white', paddingBottom: '60px' }}>
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
