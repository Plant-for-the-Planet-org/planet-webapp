import styles from './Home.module.scss';
import LandingSection from '../../../features/common/Layout/LandingSection';
import LeaderBoard from '../LeaderBoard';
import TreeCounter from '../../../features/common/TreeCounter/TreeCounter';
import Footer from '../../../features/common/Layout/Footer';
import React from 'react';
import tenantConfig from '../../../../tenant.config';
import i18next from '../../../../i18n';

const config = tenantConfig();

const { useTranslation } = i18next;

interface Props {
  leaderboard: any;
  tenantScore: any;
}

export default function About({ leaderboard, tenantScore }: Props) {
  const { t, i18n, ready } = useTranslation(['tenants']);

  const descriptionRef = React.useRef(null);
  React.useEffect(() => {
    if (descriptionRef.current !== null) {
      descriptionRef.current.innerHTML = t(`tenants:${config.tenantName}.description`);
    }
  }, [ready]);

  return ready ? (
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

        <p className={styles.publicUserDescription} style={{ fontWeight: 'bold', marginBottom: '0px' }}>
          {t(`tenants:${config.tenantName}.title`)}
        </p>

        {config.home.descriptionTitle && (
          <p className={styles.publicUserDescription} style={{ fontWeight: 'bold', marginBottom: '0px' }}>
            {t(`tenants:${config.tenantName}.descriptionTitle`)}
          </p>
        )}
        <p ref={descriptionRef} className={styles.publicUserDescription} style={{ marginTop: '8px' }}></p>
        <div style={{ marginBottom: '60px' }} />
      </LandingSection>
      {leaderboard && (leaderboard.mostDonated.length > 0 || leaderboard.mostRecent.length > 0) && <LeaderBoard leaderboard={leaderboard} />}
      <Footer />
    </main>
  ) : null;
}
