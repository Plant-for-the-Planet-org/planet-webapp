import type { UpdatedAddress } from '..';
import type { AddressAction } from './AddressActionMenu';
import type { SetState } from '../../../../../common/types/common';

import SingleAddress from './SingleAddress';

interface Props {
  addresses: UpdatedAddress[];
  setAddressAction: SetState<AddressAction | null>;
  setSelectedAddressForAction: SetState<UpdatedAddress | null>;
  setIsModalOpen: SetState<boolean>;
}

const AddressList = ({
  addresses,
  setAddressAction,
  setSelectedAddressForAction,
  setIsModalOpen,
}: Props) => {
  const addressCount = addresses?.length ?? 0;

  return (
    <>
      {addresses?.map((address) => (
        <SingleAddress
          key={address.id}
          userAddress={address}
          addressCount={addressCount}
          setAddressAction={setAddressAction}
          setIsModalOpen={setIsModalOpen}
          setSelectedAddressForAction={setSelectedAddressForAction}
        />
      ))}
    </>
  );
};

export default AddressList;
