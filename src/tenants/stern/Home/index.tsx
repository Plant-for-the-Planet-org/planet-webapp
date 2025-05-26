import type {
  LeaderBoardList,
  TenantScore,
} from '../../../features/common/types/leaderboard';

import styles from './Home.module.scss';
import LandingSection from '../../../features/common/Layout/LandingSection';
import LeaderBoard from '../../common/LeaderBoard';
import TreeCounter from '../../../features/common/TreeCounter/TreeCounter';
import Footer from '../../../features/common/Layout/Footer';
import { useTenant } from '../../../features/common/Layout/TenantContext';

interface Props {
  leaderboard: LeaderBoardList | null;
  tenantScore: TenantScore | null;
}

export default function Home({ leaderboard, tenantScore }: Props) {
  const { tenantConfig } = useTenant();

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
            target={tenantConfig.config.tenantGoal}
            planted={tenantScore.total}
            hideTarget
          />
        )}

        <p
          className={styles.publicUserDescription}
          style={{ fontWeight: 'bold', marginBottom: '0px' }}
        >
          Baum pflanzen – Zeit gewinnen
        </p>
        <p
          className={styles.publicUserDescription}
          style={{ marginTop: '8px' }}
        >
          Das Thema Klimaschutz braucht die größtmögliche Aufmerksamkeit - von
          uns allen. Publizistisch, unternehmerisch und gesellschaftlich. Einer
          unserer Beiträge ist diese Spendenaktion, die wir gemeinsam mit der
          Organisation Plant-For-The-Planet ins Leben gerufen haben. Pro
          verkauftem Exemplar der #KeinGradWeiter-Ausgabe sowie für jeden
          Besucher auf{' '}
          <a
            className="planet-links"
            href="https://stern.de"
            target="_blank"
            rel="noopener noreferrer"
          >
            stern.de
          </a>{' '}
          am Weltklimatag spendete die Redaktion des STERN einen Baum – und
          gemeinsam wollen wir künftig noch viel mehr Bäume pflanzen und somit
          den globalen STERN-Wald wachsen lassen. Jeder gepflanzte Baum bindet
          CO2 und schenkt uns Menschen wertvolle Zeit. Diese Zeit werden wir
          nutzen, um unsere CO2-Emissionen massiv zu reduzieren. Versprochen!
        </p>
      </LandingSection>
      <LeaderBoard leaderboard={leaderboard} />
      <Footer />
    </main>
  );
}
