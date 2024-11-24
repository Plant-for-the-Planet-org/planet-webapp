import type { UpdatedAddress } from '..';
import type { AddressAction } from '../../../../../common/types/profile';
import type { SetState } from '../../../../../common/types/common';

import SingleAddress from './SingleAddress';
import styles from '../AddressManagement.module.scss';

interface Props {
  addresses: UpdatedAddress[];
  setAddressAction: SetState<AddressAction | null>;
}

const AddressList = ({ addresses, setAddressAction }: Props) => {
  const addressCount = addresses?.length;

  return (
    <div className={styles.addressListContainer}>
      {addresses.map((address) => (
        <SingleAddress
          key={address.id}
          userAddress={address}
          addressCount={addressCount}
          setAddressAction={setAddressAction}
        />
      ))}
    </div>
  );
};

export default AddressList;
