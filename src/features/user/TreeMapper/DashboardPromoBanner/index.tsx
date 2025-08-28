import WebappButton from '../../../common/WebappButton';
import AlertIcon from './AlertIcon';
import styles from './DashboardPromoBanner.module.scss';

const DashboardPromoBanner = () => {
  const dashboardLink = process.env.NEXT_PUBLIC_DASHBOARD_URL;

  return (
    <div className={styles.dashboardPromoBanner}>
      <div className={styles.bannerIconContainer}>
        <AlertIcon />
      </div>
      <div className={styles.bannerContent}>
        <h3>Introducing the TreeMapper Dashboard</h3>
        <p>
          Track your planting progress, species insights, and project health in
          our new interactive dashboard.
        </p>
      </div>
      {dashboardLink !== undefined && (
      <WebappButton
        variant="primary"
        elementType="link"
          href={dashboardLink}
        target="_blank"
        text="Visit Dashboard"
        buttonClasses={styles.bannerAction}
      />
      )}
    </div>
  );
};
export default DashboardPromoBanner;
