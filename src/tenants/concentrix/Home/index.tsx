import Banner from './sections/Banner';
import CountryLeaderboard from './sections/CountryLeaderboard';
import ResponsibilityStatement from './sections/ResponsibilityStatement';
import PartnershipShowcase from './sections/PartnershipShowcase';
import Sustainability from './sections/Sustainability';
import Footer from '../../../features/common/Layout/Footer';
import styles from './Home.module.scss';

const Home = () => {
  return (
    <main className={styles.home}>
      <Banner />
      <CountryLeaderboard />
      <ResponsibilityStatement />
      <PartnershipShowcase />
      <Sustainability />
      <Footer />
    </main>
  );
};
export default Home;
