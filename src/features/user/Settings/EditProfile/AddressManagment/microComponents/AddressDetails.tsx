import type { Address } from '@planet-sdk/common';

import { useTranslations } from 'next-intl';
import styles from '../AddressManagement.module.scss';
import FormattedAddressBlock from './FormattedAddressBlock';

interface Props {
  userAddress: Address;
}
const AddressDetails = ({ userAddress }: Props) => {
  const { type } = userAddress;
  const tProfile = useTranslations('Profile.addressManagement');

  return (
    <div className={styles.addressDetails}>
      {type !== 'other' && (
        <span className={styles[type]}>{tProfile(`addressType.${type}`)}</span>
      )}
      <FormattedAddressBlock userAddress={userAddress} />
    </div>
  );
};

export default AddressDetails;
