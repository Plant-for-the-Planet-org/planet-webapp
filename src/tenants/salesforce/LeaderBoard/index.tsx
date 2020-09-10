import Footer from '../../../features/common/Footer';
import Articles from './components/Articles';
import Blogs from './components/Blogs';
import Landing from './components/Landing';
import LeaderBoard from './components/LeaderBoardSection';
import LearnMore from './components/LearnMore';
import TreeCounterSection from './components/TreeCounter';

interface Props {
  leaderboard: any;
}

export default function About(leaderboard: Props) {
  return (
    <main style={{ height: '100vh', overflowX: 'hidden' }}>
      <Landing />
      <TreeCounterSection />
      <LearnMore />
      <LeaderBoard leaderboard={leaderboard} />
      <Articles />
      <Blogs />
      <Footer />
    </main>
  );
}
