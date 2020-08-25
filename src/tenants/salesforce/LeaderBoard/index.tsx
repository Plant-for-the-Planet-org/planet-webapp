import Footer from '../../../features/common/Footer';
import Articles from './components/Articles';
import Blogs from './components/Blogs';
import Landing from './components/Landing';
import LeaderBoard from './components/LeaderBoardSection';
import LearnMore from './components/LearnMore';
import TreeCounterSection from './components/TreeCounter';

export default function About() {
  return (
    <main>
      <Landing />
      <TreeCounterSection />
      <LearnMore />
      <LeaderBoard />
      <Articles />
      <Blogs />
      <Footer />
    </main>
  );
}
