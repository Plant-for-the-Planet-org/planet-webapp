import type { SetState } from '../../../../../common/types/common';
import type { AddressAction } from '../../../../../common/types/profile';
import type { Address } from '@planet-sdk/common';

import styles from '../AddressManagement.module.scss';
import AddressDetails from './AddressDetails';
import AddressActionsMenu from './AddressActionMenu';

interface Props {
  userAddress: Address;
  addressCount: number;
  setAddressAction: SetState<AddressAction | null>;
  setSelectedAddressForAction: SetState<Address | null>;
  setIsModalOpen: SetState<boolean>;
}

const SingleAddress = ({
  userAddress,
  addressCount,
  setIsModalOpen,
  setAddressAction,
  setSelectedAddressForAction,
}: Props) => {
  return (
    <div className={styles.singleAddressContainer}>
      <AddressDetails userAddress={userAddress} />
      <AddressActionsMenu
        type={userAddress.type}
        addressCount={addressCount}
        setAddressAction={setAddressAction}
        setIsModalOpen={setIsModalOpen}
        setSelectedAddressForAction={setSelectedAddressForAction}
        userAddress={userAddress}
      />
    </div>
  );
};

export default SingleAddress;
