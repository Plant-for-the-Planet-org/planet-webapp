import type { UpdatedAddress } from '..';
import type { AddressAction } from './AddressActions';

import { useState } from 'react';
import SingleAddress from './SingleAddress';

const AddressList = ({ addresses }: { addresses: UpdatedAddress[] }) => {
  const [addressAction, setAddressAction] = useState<AddressAction | null>(
    null
  );
  const addressCount = addresses.length;

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
