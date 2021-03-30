import Footer from '../../../features/common/Layout/Footer';
import Articles from './components/Articles';
import Blogs from './components/Blogs';
import Landing from './components/Landing';
import LeaderBoard from './components/LeaderBoardSection';
import TreeCounterSection from './components/ContentSection';

interface Props {
  leaderboard: any;
  tenantScore: any;
}

export default function About({ tenantScore, leaderboard }: Props) {
  return (
    <main style={{backgroundColor: 'white'}}>
      <Landing tenantScore={tenantScore} />
      <TreeCounterSection />
      <LeaderBoard leaderboard={leaderboard} />
      <Articles />
      <Blogs />
      <Footer />
    </main>
  );
}
