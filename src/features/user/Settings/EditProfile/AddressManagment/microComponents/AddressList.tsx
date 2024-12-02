import type { AddressAction } from '../../../../../common/types/profile';
import type { SetState } from '../../../../../common/types/common';
import type { Address } from '@planet-sdk/common';

import SingleAddress from './SingleAddress';
import styles from '../AddressManagement.module.scss';

interface Props {
  addresses: Address[];
  setAddressAction: SetState<AddressAction | null>;
  setSelectedAddressForAction: SetState<Address | null>;
  setIsModalOpen: SetState<boolean>;
}

const AddressList = ({
  addresses,
  setAddressAction,
  setSelectedAddressForAction,
  setIsModalOpen,
}: Props) => {
  const addressCount = addresses?.length;

  return (
    <div className={styles.addressListContainer}>
      {addresses.map((address) => (
        <SingleAddress
          key={address.id}
          userAddress={address}
          addressCount={addressCount}
          setAddressAction={setAddressAction}
          setSelectedAddressForAction={setSelectedAddressForAction}
          setIsModalOpen={setIsModalOpen}
        />
      ))}
    </div>
  );
};

export default AddressList;
