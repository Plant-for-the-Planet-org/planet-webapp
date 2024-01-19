import styles from './Home.module.scss';
import LandingSection from '../../../features/common/Layout/LandingSection';
import LeaderBoard from '../LeaderBoard';
import TreeCounter from '../../../features/common/TreeCounter/TreeCounter';
import Footer from '../../../features/common/Layout/Footer';
import React from 'react';
import { useTenant } from '../../../features/common/Layout/TenantContext';
import { useTranslation } from 'next-i18next';
import {
  LeaderBoardList,
  TenantScore,
} from '../../../features/common/types/leaderboard';

interface Props {
  leaderboard: LeaderBoardList | null;
  tenantScore: TenantScore | null;
}

export default function About({ leaderboard, tenantScore }: Props) {
  const { tenantConfig } = useTenant();
  const { t, ready } = useTranslation(['tenants']);

  const descriptionRef = React.useRef<HTMLParagraphElement>(null);
  React.useEffect(() => {
    if (descriptionRef.current !== null) {
      descriptionRef.current.innerHTML = t(
        `tenants:${tenantConfig.config.slug}.description`
      );
    }
  }, [ready]);

  return ready ? (
    <main>
      <LandingSection imageSrc={tenantConfig.config.meta.image}>
        <div style={{ marginTop: '120px' }} />
        {console.log('Basic Tenant', tenantScore?.total)}
        {tenantScore && (
          <TreeCounter
            target={tenantConfig.tenantGoal}
            planted={tenantScore.total}
          />
        )}
        <p
          className={styles.publicUserDescription}
          style={{ fontWeight: 'bold', marginBottom: '0px' }}
        >
          {t(`tenants:${tenantConfig.config.slug}.title`)}
        </p>
        <p
          ref={descriptionRef}
          className={styles.publicUserDescription}
          style={{ marginTop: '8px' }}
        ></p>
        <div style={{ marginBottom: '60px' }} />
      </LandingSection>
      {leaderboard &&
        (leaderboard.mostDonated.length > 0 ||
          leaderboard.mostRecent.length > 0) && (
          <LeaderBoard leaderboard={leaderboard} />
        )}
      <Footer />
    </main>
  ) : null;
}
