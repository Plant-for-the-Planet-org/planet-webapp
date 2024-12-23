import type { Address } from '@planet-sdk/common';

import { useTranslations } from 'next-intl';
import styles from '../AddressManagement.module.scss';
import FormattedAddressBlock from './FormattedAddressBlock';

interface Props {
  userAddress: Address;
}
const AddressDetails = ({ userAddress }: Props) => {
  const { type } = userAddress;
  const tAddressManagement = useTranslations('EditProfile.addressManagement');

  return (
    <div className={styles.addressDetails}>
      {type !== 'other' && (
        <span className={styles[type]}>
          {tAddressManagement(`addressType.${type}`)}
        </span>
      )}
      <FormattedAddressBlock userAddress={userAddress} />
    </div>
  );
};

export default AddressDetails;
