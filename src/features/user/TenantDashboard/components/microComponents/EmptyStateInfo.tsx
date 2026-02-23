import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';
import styles from '../../TenantDashboard.module.scss';

const EmptyStateInfo = () => {
  const t = useTranslations('Profile.tenant');
  return (
    <div className={clsx(styles.card, styles.emptyState)}>
      <p>{t('noDataForRange')}</p>
    </div>
  );
};

export default EmptyStateInfo;
