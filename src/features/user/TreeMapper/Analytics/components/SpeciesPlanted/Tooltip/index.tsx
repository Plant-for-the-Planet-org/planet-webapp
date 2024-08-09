import { useLocale } from 'next-intl';
import { getFormattedNumber } from '../../../../../../../utils/getFormattedNumber';
import styles from './index.module.scss';

interface Props {
  headerTitle: string;
  bodyTitle: string;
  value: string;
}

export const Tooltip = ({ headerTitle, bodyTitle, value }: Props) => {
  const locale = useLocale();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.title}>{headerTitle}</p>
      </div>
      <div className={styles.body}>
        <span className={styles.circle}></span>
        <p className={styles.bodyTitle}>{bodyTitle}</p>
        <p className={styles.value}>
          {getFormattedNumber(locale, parseInt(value))}
        </p>
      </div>
    </div>
  );
};
