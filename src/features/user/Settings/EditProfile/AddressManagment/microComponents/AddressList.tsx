import type { UpdatedAddress } from '..';
import type { AddressAction } from './AddressActionMenu';
import type { SetState } from '../../../../../common/types/common';

import SingleAddress from './SingleAddress';

interface Props {
  addresses: UpdatedAddress[];
  setAddressAction: SetState<AddressAction | null>;
}

const AddressList = ({ addresses, setAddressAction }: Props) => {
  const addressCount = addresses?.length;

  return (
    <>
      {addresses.map((address) => (
        <SingleAddress
          key={address.id}
          userAddress={address}
          addressCount={addressCount}
          setAddressAction={setAddressAction}
        />
      ))}
    </>
  );
};

export default AddressList;
