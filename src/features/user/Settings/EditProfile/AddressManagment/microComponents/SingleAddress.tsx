import type { UpdatedAddress } from '..';
import type { SetState } from '../../../../../common/types/common';
import type { AddressAction } from './AddressActionMenu';

import styles from '../AddressManagement.module.scss';
import AddressDetails from './AddressDetails';
import AddressActionsMenu from './AddressActionMenu';

interface Props {
  userAddress: UpdatedAddress;
  addressCount: number;
  setAddressAction: SetState<AddressAction | null>;
}

const SingleAddress = ({
  userAddress,
  addressCount,
  setAddressAction,
}: Props) => {
  return (
    <div className={styles.addressContainer}>
      <AddressDetails userAddress={userAddress} />
      <AddressActionsMenu
        type={userAddress.type}
        addressCount={addressCount}
        setAddressAction={setAddressAction}
      />
    </div>
  );
};

export default SingleAddress;
