import styles from './Home.module.scss';
import LandingSection from '../../../features/common/Layout/LandingSection';
import LeaderBoard from '../../common/LeaderBoard';
import TreeCounter from '../../../features/common/TreeCounter/TreeCounter';
import Footer from '../../../features/common/Layout/Footer';
import tenantConfig from './../../../../tenant.config'
import React from 'react';
const config = tenantConfig();

interface Props {
  leaderboard: any;
  tenantScore: any;
}

export default function About({ leaderboard, tenantScore }: Props) {
  const descriptionRef = React.useRef(null);
  React.useEffect(() => {
    if (descriptionRef.current !== null) {
      descriptionRef.current.innerHTML = config.home.description;
    }
  }, []);
  return (
    <main>
      <LandingSection
        imageSrc={config.meta.image}>
        <div style={{ marginTop: '120px' }} />
        {tenantScore
          && (
            <TreeCounter
              target={config.tenantGoal}
              planted={tenantScore.total}
            />
          )}

        <p className={styles.publicUserDescription} style={{ fontWeight: 'bold', marginBottom: '0px' }}>{config.home.title}</p>
        {config.home.descriptionTitle && (
          <p className={styles.publicUserDescription} style={{ fontWeight: 'bold', marginBottom: '0px' }}>{config.home.descriptionTitle}</p>
        )}
        <p ref={descriptionRef} className={styles.publicUserDescription} style={{ marginTop: '8px' }}></p>
        <div style={{ marginBottom: '60px' }} />
      </LandingSection>
      <LeaderBoard leaderboard={leaderboard} />
      <Footer />
    </main>
  );
}
