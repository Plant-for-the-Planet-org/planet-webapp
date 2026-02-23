import { useTranslations } from 'next-intl';
import formatDate from '../../../../../utils/countryCurrency/getFormattedDate';
import styles from '../../TenantDashboard.module.scss';

interface DateRangeInfoProps {
  fromDate: Date;
  toDate: Date;
}

const DateRangeInfo = ({ fromDate, toDate }: DateRangeInfoProps) => {
  const t = useTranslations('Profile.tenant');
  return (
    <p className={styles.dateRangeInfo}>
      {t('dateRange', {
        from: formatDate(fromDate),
        to: formatDate(toDate),
      })}
    </p>
  );
};

export default DateRangeInfo;
