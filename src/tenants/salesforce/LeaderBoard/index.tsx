import Footer from '../../../features/common/Footer';
import Articles from './components/Articles';
import Blogs from './components/Blogs';
import Landing from './components/Landing';
import LeaderBoard from './components/LeaderBoardSection';
import LearnMore from './components/LearnMore';
import TreeCounterSection from './components/TreeCounter';

interface Props {
  leaderboard: any;
  tenantScore: any;
}

export default function About({ tenantScore, leaderboard }: Props) {
  return (
    <main>
      <Landing />
      <TreeCounterSection tenantScore={tenantScore} />
      <LearnMore />
      <LeaderBoard leaderboard={leaderboard} />
      <Articles />
      <Blogs />
      <Footer />
    </main>
  );
}
