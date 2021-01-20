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
        imageSrc={config.meta.image}>
        <div style={{ marginTop:'120px' }} />
        {tenantScore && tenantScore.total
          && (
          <TreeCounter
            target={config.tenantGoal}
            planted={tenantScore.total}
          />
          ) }

        <p className={styles.publicUserDescription} style={{ fontWeight: 'bold', marginBottom: '0px' }}>{config.home.title}</p>
        <p className={styles.publicUserDescription} style={{ marginTop: '8px' }}>{config.home.description}</p>
        <div style={{ marginBottom:'60px' }} />
      </LandingSection>
      <LeaderBoard leaderboard={leaderboard} />
      <Footer />
    </main>
  );
}
