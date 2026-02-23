import type { RecentDonorApi } from '../types';

import { useTranslations } from 'next-intl';
import RecentDonorIcon from '../../../../../public/assets/images/icons/tenantDashboard/RecentDonorIcon';
import styles from '../TenantDashboard.module.scss';
import DonorRow from './microComponents/DonorRow';
import { clsx } from 'clsx';

interface RecentDonorsProp {
  recentDonors: RecentDonorApi[];
}

const RecentDonors = ({ recentDonors }: RecentDonorsProp) => {
  const t = useTranslations('Profile.tenant');
  return (
    <section className={clsx(styles.card, styles.recentDonors)}>
      <div className={styles.cardHeader}>
        <RecentDonorIcon />
        <h2 className={styles.cardTitle}>{t('recentDonors')}</h2>
      </div>
      <ul>
        {recentDonors.map((donor) => (
          <DonorRow
            key={`${donor.donor}-${donor.created}`}
            donorName={donor.donor}
            unitDonated={donor.units}
            unitType={donor.unitType}
          />
        ))}
      </ul>
    </section>
  );
};
export default RecentDonors;
