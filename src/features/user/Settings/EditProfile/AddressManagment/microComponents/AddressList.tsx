import type { UpdatedAddress } from '..';
import type { AddressAction } from './AddressActionMenu';
import type { SetState } from '../../../../../common/types/common';

import SingleAddress from './SingleAddress';

interface Props {
  addresses: UpdatedAddress[];
  addressAction: AddressAction | null;
  setAddressAction: SetState<AddressAction | null>;
  setUserAddresses: SetState<UpdatedAddress[]>;
}

const AddressList = ({
  addresses,
  addressAction,
  setAddressAction,
  setUserAddresses,
}: Props) => {
  const addressCount = addresses?.length;

  return (
    <>
      {addresses.map((address) => (
        <SingleAddress
          key={address.id}
          userAddress={address}
          addressCount={addressCount}
          addressAction={addressAction}
          setAddressAction={setAddressAction}
          setUserAddresses={setUserAddresses}
        />
      ))}
    </>
  );
};

export default AddressList;
