import styles from './Home.module.scss';
import LandingSection from '../../../features/common/Layout/LandingSection';
import LeaderBoard from '../../common/LeaderBoard';
import TreeCounter from '../../../features/common/TreeCounter/TreeCounter';
import Footer from '../../../features/common/Layout/Footer';
import tenantConfig from './../../../../tenant.config';
const config = tenantConfig();

interface Props {
  leaderboard: any;
  tenantScore: any;
}

export default function About({ leaderboard, tenantScore }: Props) {
  return (
    <main>
      <LandingSection
        imageSrc={
          process.env.CDN_URL
            ? `${process.env.CDN_URL}/media/images/app/bg_layer.jpg`
            : 'https://cdn.plant-for-the-planet.org/media/images/app/bg_layer.jpg'
        }
      >
        <div style={{ marginTop: '64px' }} />
        {tenantScore && tenantScore.total && (
          <TreeCounter
            target={config.tenantGoal}
            planted={tenantScore.total}
            hideTarget
          />
        )}

        <p
          className={styles.publicUserDescription}
          style={{ fontWeight: 'bold', marginBottom: '0px' }}
        >
          Plant Trees with La Coqueta
        </p>
        <p
          className={styles.publicUserDescription}
          style={{ marginTop: '8px' }}
        >
        Seeing her own children grow up and become increasingly interested in the climate crisis has inspired Celia to use her brand as a platform for positive change. After learning that trees are the most economical and effective means of binding CO2, allowing more time to reduce greenhouse gas emissions to zero and mitigate the climate crisis, they decided to embark on this exciting journey with Plant-for-the-Planet. You can also become part of that journey and donate some trees – in Granada, the hometown of Celia, or other areas around the world.
        </p>
      </LandingSection>
      <LeaderBoard leaderboard={leaderboard} />
      <Footer />
    </main>
  );
}
