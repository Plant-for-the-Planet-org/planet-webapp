import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';
import styles from '../../TenantDashboard.module.scss';
import NoDataFound from '../../../../../../public/assets/images/icons/projectV2/NoDataFound';

const EmptyStateInfo = () => {
  const t = useTranslations('Profile.tenant');
  return (
    <div className={clsx(styles.card, styles.emptyState)}>
      <NoDataFound />
      <p className={styles.description}>{t('noDataForRange')}</p>
    </div>
  );
};

export default EmptyStateInfo;
