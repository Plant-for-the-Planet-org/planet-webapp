import { useTranslations } from 'next-intl';
import styles from '../../TenantDashboard.module.scss';

interface DonorItem {
  donorName: string;
  unitDonated: number;
  unitType: 'tree' | 'm2';
}
const DonorRow = ({ donorName, unitDonated, unitType }: DonorItem) => {
  const t = useTranslations('Profile.tenant');
  return (
    <li className={styles.donorRow}>
      <span className={styles.donorName} title={donorName}>
        {donorName}
      </span>
      <span className={styles.donorContribution}>
        {t('donationUnit', {
          count: unitDonated,
          unitType,
        })}
      </span>
    </li>
  );
};

export default DonorRow;
