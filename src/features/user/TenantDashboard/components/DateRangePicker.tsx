import { TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { localeMapForDate } from '../../../../utils/language/getLanguageName';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import styles from '../TenantDashboard.module.scss';

interface DateRangePickerProps {
  fromDate: Date | null;
  toDate: Date | null;
  today: Date;
  onFromDateChange: (newValue: Date | null) => void;
  onToDateChange: (newValue: Date | null) => void;
}

const DateRangePicker = ({
  fromDate,
  toDate,
  today,
  onFromDateChange,
  onToDateChange,
}: DateRangePickerProps) => {
  const { userLang } = useUserProps();
  return (
    <section className={styles.dateRangeContainer}>
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        adapterLocale={
          localeMapForDate[userLang]
            ? localeMapForDate[userLang]
            : localeMapForDate['en']
        }
      >
        <DatePicker
          label="From"
          value={fromDate}
          onChange={onFromDateChange}
          maxDate={toDate ?? today}
          inputFormat="MMM dd, yyyy"
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              sx={{
                width: { xs: '100%', sm: 206 },
              }}
            />
          )}
        />

        <DatePicker
          label={'To'}
          value={toDate}
          onChange={onToDateChange}
          minDate={fromDate ?? undefined}
          maxDate={today}
          inputFormat="MMM dd, yyyy"
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              sx={{
                width: { xs: '100%', sm: 206 },
              }}
            />
          )}
        />
      </LocalizationProvider>
    </section>
  );
};

export default DateRangePicker;
