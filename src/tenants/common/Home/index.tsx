import type {
  LeaderBoardList,
  TenantScore,
} from '../../../features/common/types/leaderboard';

import { useEffect, useRef } from 'react';
import styles from './Home.module.scss';
import LandingSection from '../../../features/common/Layout/LandingSection';
import LeaderBoard from '../LeaderBoard';
import TreeCounter from '../../../features/common/TreeCounter/TreeCounter';
import Footer from '../../../features/common/Layout/Footer';
import { useTranslations } from 'next-intl';
import { useTenantStore } from '../../../stores/tenantStore';

interface Props {
  leaderboard: LeaderBoardList | null;
  tenantScore: TenantScore | null;
}

export default function Home({ leaderboard, tenantScore }: Props) {
  const t = useTranslations('Tenants');
  // store: state
  const tenantConfig = useTenantStore((state) => state.tenantConfig);

  const descriptionRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (descriptionRef.current !== null) {
      descriptionRef.current.innerHTML = t(
        `${tenantConfig.config.slug}.description`
      );
    }
  }, []);

  return (
    <main>
      <LandingSection imageSrc={tenantConfig.config.meta.image}>
        <div style={{ marginTop: '120px' }} />
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
          {t(`${tenantConfig.config.slug}.title`)}
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
  );
}
