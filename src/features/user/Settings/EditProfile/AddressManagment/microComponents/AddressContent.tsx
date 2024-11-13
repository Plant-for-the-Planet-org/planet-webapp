import styles from '../AddressManagement.module.scss';
import { useTranslations } from 'next-intl';
import { AddressType } from './AddressActionMenu';
import { ADDRESS_TYPE } from '../../../../../../utils/addressManagement';

interface Props {
  type: AddressType;
  userAddress: string;
}
const AddressContent = ({ type, userAddress }: Props) => {
  const tProfile = useTranslations('Profile.addressManagement');
  return (
    <div className={styles.addressSubContainer}>
      {type !== 'other' && (
        <span className={`${styles.addressTag} ${styles[type]}`}>
          {tProfile(
            `${
              type === ADDRESS_TYPE.PRIMARY
                ? 'primaryAddress'
                : 'BillingAddress'
            }`
          )}
        </span>
      )}
      <div className={styles.address}>{userAddress}</div>
    </div>
  );
};

export default AddressContent;
