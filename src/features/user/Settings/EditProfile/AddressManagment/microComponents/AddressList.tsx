import type { UpdatedAddress } from '..';
import type { AddressAction } from './AddressActionMenu';
import type { SetState } from '../../../../../common/types/common';

import { useMemo } from 'react';
import SingleAddress from './SingleAddress';
import {
  ADDRESS_TYPE,
  findAddressByType,
} from '../../../../../../utils/addressManagement';

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

  const primaryAddress = useMemo(
    () => findAddressByType(addresses, ADDRESS_TYPE.PRIMARY),
    [addresses]
  );
  const billingAddress = useMemo(
    () => findAddressByType(addresses, ADDRESS_TYPE.MAILING),
    [addresses]
  );
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
          primaryAddress={primaryAddress}
          billingAddress={billingAddress}
        />
      ))}
    </>
  );
};

export default AddressList;
