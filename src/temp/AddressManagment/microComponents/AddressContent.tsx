import styles from '../AddressManagement.module.scss';
import { useTranslations } from 'next-intl';

interface Props {
  type: 'primary' | 'mailing' | 'other';
  userAddress: string;
}
const AddressContent = ({ type, userAddress }: Props) => {
  const t = useTranslations('Me');
  return (
    <div className={styles.addressSubContainer}>
      {type !== 'other' && (
        <span className={`${styles.addressTag} ${styles[type]}`}>
          {t(
            `addressManagement.${
              type === 'primary' ? 'primaryAddress' : 'BillingAddress'
            }`
          )}
        </span>
      )}
      <div className={styles.address}>{userAddress}</div>
    </div>
  );
};

export default AddressContent;
