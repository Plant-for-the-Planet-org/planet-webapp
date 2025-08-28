import CenteredContainer from '../../../common/Layout/CenteredContainer';
import DashboardView from '../../../common/Layout/DashboardView';
import SingleColumnView from '../../../common/Layout/SingleColumnView';
import WebappButton from '../../../common/WebappButton';
import MigrationGraphic from './MigrationGraphic';
import styles from './FeatureMigrated.module.scss';
import { useTranslations } from 'next-intl';

type Props = {
  status: 'in-progress' | 'completed';
  featureKey: 'treemapper' | 'import' | 'my-species' | 'data-explorer';
};

const FeatureMigrated = ({ status, featureKey }: Props) => {
  const tTreemapperMigration = useTranslations('Treemapper.migration');
  const dashboardLink = process.env.NEXT_PUBLIC_DASHBOARD_URL;

  return (
    <DashboardView>
      <SingleColumnView>
        <CenteredContainer>
          <div className={styles.migrationContainer}>
            <MigrationGraphic />
            <div className={styles.migrationContent}>
              <div className={styles.migrationContentTitle}>
                {tTreemapperMigration(`${status}.${featureKey}.title`)}
              </div>
              <div className={styles.migrationContentSubtitle}>
                {tTreemapperMigration(`${status}.${featureKey}.subtitle`)}
              </div>
            </div>
            {dashboardLink !== undefined && (
              <WebappButton
                elementType="link"
                href={dashboardLink}
                target="_blank"
                variant="primary"
                text={tTreemapperMigration('dashboardButton')}
              />
            )}
          </div>
        </CenteredContainer>
      </SingleColumnView>
    </DashboardView>
  );
};
export default FeatureMigrated;
