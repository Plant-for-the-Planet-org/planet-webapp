import Banner from './sections/Banner';
import Footer from '../../../features/common/Layout/Footer';

import styles from './Home.module.scss';
import CountryLeaderboard from './sections/CountryLeaderboard';

const Home = () => {
  return (
    <main className={styles.home}>
      <Banner />
      <CountryLeaderboard />
      <div>Temp Section 3</div>
      <div>Temp Partnership Section</div>
      <div>Sustainability and Impact</div>
      <Footer />
    </main>
  );
};
export default Home;
