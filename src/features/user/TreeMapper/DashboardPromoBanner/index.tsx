import { useTranslations } from 'next-intl';
import WebappButton from '../../../common/WebappButton';
import AlertIcon from './AlertIcon';
import styles from './DashboardPromoBanner.module.scss';

const DashboardPromoBanner = () => {
  const tDashboardPromo = useTranslations('Treemapper.migration.promoBanner');
  const dashboardLink = process.env.NEXT_PUBLIC_DASHBOARD_URL;

  return (
    <div className={styles.dashboardPromoBanner}>
      <div className={styles.bannerIconContainer}>
        <AlertIcon />
      </div>
      <div className={styles.bannerContent}>
        <h3>{tDashboardPromo('title')}</h3>
        <p>{tDashboardPromo('subtitle')}</p>
      </div>
      {dashboardLink !== undefined && (
        <WebappButton
          variant="primary"
          elementType="link"
          href={dashboardLink}
          target="_blank"
          text={tDashboardPromo('buttonText')}
          buttonClasses={styles.bannerAction}
        />
      )}
    </div>
  );
};
export default DashboardPromoBanner;
