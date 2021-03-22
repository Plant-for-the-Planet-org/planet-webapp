import Footer from '../../../features/common/Layout/Footer';
import FarmerAchievements from './components/FarmerAchievements';
import LeaderBoard from './components/LeaderBoardSection';
import TreeCounterSection from './components/TreeCounter';

interface Props {
  leaderboard: any;
  tenantScore: any;
}

export default function About({ tenantScore, leaderboard }: Props) {
  return (
    <main>
      <TreeCounterSection tenantScore={tenantScore} />
      <LeaderBoard leaderboard={leaderboard} />
      {/* <FarmerAchievements/> */}
      <Footer />
    </main>
  );
}
