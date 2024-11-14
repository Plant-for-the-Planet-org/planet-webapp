import type { UpdatedAddress } from '..';
import type { AddressAction } from './AddressActionMenu';
import type { SetState } from '../../../../../common/types/common';

import SingleAddress from './SingleAddress';

interface Props {
  addresses: UpdatedAddress[] | undefined;
  addressAction: AddressAction | null;
  setAddressAction: SetState<AddressAction | null>;
  setUserAddresses: SetState<UpdatedAddress[]>;
  fetchUserAddresses: () => Promise<void>;
  isUploadingData: boolean;
  setIsUploadingData: SetState<boolean>;
}

const AddressList = ({
  fetchUserAddresses,
  addressAction,
  setAddressAction,
  addresses,
  setUserAddresses,
  isUploadingData,
  setIsUploadingData,
}: Props) => {
  const addressCount = addresses?.length ?? 0;

  return (
    <>
      {addresses?.map((address) => (
        <SingleAddress
          key={address.id}
          addressCount={addressCount}
          addressAction={addressAction}
          userAddress={address}
          setUserAddresses={setUserAddresses}
          setAddressAction={setAddressAction}
          fetchUserAddresses={fetchUserAddresses}
          isUploadingData={isUploadingData}
          setIsUploadingData={setIsUploadingData}
        />
      ))}
    </>
  );
};

export default AddressList;
