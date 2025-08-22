import { useTranslations } from 'next-intl';
import styles from './index.module.scss';
import { Grid } from '@mui/material';

interface Props {
  quantity: number;
  label: string;
}

const ONE_THOUSAND = 1000;
const ONE_MILLION = ONE_THOUSAND * 1000;
const ONE_BILLION = ONE_MILLION * 1000;
const ONE_TRILLION = ONE_BILLION * 1000;

export const CounterItem = ({ quantity, label }: Props) => {
  const t = useTranslations('TreemapperAnalytics');

  function formatNumber(num: number) {
    if (num >= ONE_TRILLION) {
      return (
        (num / ONE_TRILLION).toFixed(1).replace(/\.0$/, '') + t('trillion')
      );
    } else if (num >= ONE_BILLION) {
      return (num / ONE_BILLION).toFixed(1).replace(/\.0$/, '') + t('billion');
    } else if (num >= ONE_MILLION) {
      return (num / ONE_MILLION).toFixed(1).replace(/\.0$/, '') + t('million');
    } else if (num >= ONE_THOUSAND) {
      return (
        (num / ONE_THOUSAND).toFixed(1).replace(/\.0$/, '') + t('thousand')
      );
    } else {
      return num.toString();
    }
  }

  return (
    <Grid item className={styles.container}>
      <p className={styles.quantity}> {formatNumber(quantity)} </p>
      <p>{label}</p>
    </Grid>
  );
};
