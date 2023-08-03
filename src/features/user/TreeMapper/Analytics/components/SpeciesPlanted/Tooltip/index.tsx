import { useTranslation } from 'react-i18next';
import { getFormattedNumber } from '../../../../../../../utils/getFormattedNumber';
import styles from './index.module.scss';

interface Props {
  headerTitle: string;
  bodyTitle: string;
  value: string;
}

export const Tooltip = ({ headerTitle, bodyTitle, value }: Props) => {
  const {
    i18n: { language },
  } = useTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.title}>{headerTitle}</p>
      </div>
      <div className={styles.body}>
        <span className={styles.circle}></span>
        <p className={styles.bodyTitle}>{bodyTitle}</p>
        <p className={styles.value}>
          {getFormattedNumber(language, parseInt(value))}
        </p>
      </div>
    </div>
  );
};
