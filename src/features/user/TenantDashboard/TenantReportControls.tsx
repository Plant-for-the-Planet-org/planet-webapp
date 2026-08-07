import type { SetState } from '../../common/types/common';

import { useTranslations } from 'next-intl';
import WebappButton from '../../common/WebappButton';
import DateRangePicker from './components/DateRangePicker';
import styles from './TenantDashboard.module.scss';
import { useMemo } from 'react';

interface TenantReportControlsProps {
  fromDate: Date | null;
  toDate: Date | null;
  setFromDate: SetState<Date | null>;
  setToDate: SetState<Date | null>;
  handleApply: (fromDate: Date | null, toDate: Date | null) => void;
  isEmptyResult: boolean;
  isFetching: boolean;
}

const TenantReportControls = ({
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  handleApply,
  isEmptyResult,
  isFetching,
}: TenantReportControlsProps) => {
  const today = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }, []);

  const t = useTranslations('Profile.tenant');

  return (
    <div className={styles.reportControls}>
      <DateRangePicker
        fromDate={fromDate}
        toDate={toDate}
        today={today}
        setFromDate={setFromDate}
        setToDate={setToDate}
        onApply={handleApply}
      />

      <WebappButton
        elementType="button"
        onClick={() => window.print()}
        text={t('print')}
        variant="primary"
        buttonClasses={styles.printButton}
        disabled={isEmptyResult || isFetching}
      />
    </div>
  );
};

export default TenantReportControls;
