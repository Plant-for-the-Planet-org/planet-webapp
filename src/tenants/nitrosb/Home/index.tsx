import styles from './Home.module.scss';
import LandingSection from '../../../features/common/Layout/LandingSection';
import LeaderBoard from '../../common/LeaderBoard';
import TreeCounter from '../../../features/common/TreeCounter/TreeCounter';
import Footer from '../../../features/common/Layout/Footer';
import tenantConfig from './../../../../tenant.config'
const config = tenantConfig();

interface Props {
  leaderboard: any;
  tenantScore:any;
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
        <div style={{ marginTop:'64px' }} />
        {tenantScore && tenantScore.total
          && (
          <TreeCounter
            target={config.tenantGoal}
            planted={tenantScore.total}
          />
          ) }

        <p className={styles.publicUserDescription} style={{ fontWeight: 'bold', marginBottom: '0px' }}>Plant Trees with Nitro Snow Boards</p>
        <p className={styles.publicUserDescription} style={{ marginTop: '8px' }}>
        Nitro Snow Boards set a goal to support and mobilize the conservation, restoration, and growth of a forest.
        </p>
      </LandingSection>
      <LeaderBoard leaderboard={leaderboard} />
      <Footer />
    </main>
  );
}
