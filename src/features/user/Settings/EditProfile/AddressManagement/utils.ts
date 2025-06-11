import type { Address, AddressType, User } from '@planet-sdk/common';
import { ADDRESS_TYPE } from '../../../../../utils/addressManagement';

/**
 * Updates the user's addresses after adding a new address.
 * - If the new address is of type PRIMARY, existing PRIMARY addresses are downgraded to OTHER.
 * - The new address is appended to the list.
 *
 * @param user - The current user object or null.
 * @param newAddress - The new address being added.
 * @returns Updated user object with the modified address list, or null if user is null.
 */

export const updateAddressesAfterAdd = (
  user: User | null,
  newAddress: Address
): User | null => {
  if (!user) return null;

  const updatedAddresses =
    newAddress.type === ADDRESS_TYPE.PRIMARY
      ? user.addresses.map((address) =>
          address.type === ADDRESS_TYPE.PRIMARY
            ? { ...address, type: ADDRESS_TYPE.OTHER, isPrimary: false }
            : address
        )
      : user.addresses;

  return {
    ...user,
    addresses: [...updatedAddresses, newAddress],
  };
};

/**
 * Updates the user's addresses after editing an address.
 * - Replaces the old address with the edited one.
 * - If the edited address is marked as primary, any existing primary address is downgraded.
 *
 * @param user - The current user object or null.
 * @param editedAddress - The address that has been edited.
 * @returns Updated user object with the modified address list, or null if user is null.
 */

export const updateAddressesAfterEdit = (
  user: User | null,
  editedAddress: Address
): User | null => {
  if (!user) return null;

  const updatedAddresses = user.addresses.reduce<Address[]>(
    (nonEditedAddresses, address) => {
      if (address.id === editedAddress.id) return nonEditedAddresses;

      if (
        editedAddress.type === ADDRESS_TYPE.PRIMARY &&
        address.type === ADDRESS_TYPE.PRIMARY
      ) {
        nonEditedAddresses.push({
          ...address,
          isPrimary: false,
          type: ADDRESS_TYPE.OTHER,
        });
      } else {
        nonEditedAddresses.push(address);
      }

      return nonEditedAddresses;
    },
    []
  );

  updatedAddresses.push(editedAddress);

  return {
    ...user,
    addresses: updatedAddresses,
  };
};

/**
 * Updates the address type for a specific address.
 * - The address with the specified ID gets the new type.
 * - Any other address currently using that type is downgraded to OTHER.
 *
 * @param user - The current user object or null.
 * @param updatedAddress - The address to update.
 * @param newType - The new address type to assign.
 * @returns Updated user object with the modified address list, or null if user is null.
 */
export const updateAddressesAfterTypeChange = (
  user: User | null,
  updatedAddress: Address,
  newType: AddressType
): User | null => {
  if (!user) return null;

  const updatedAddresses = user.addresses.map((address) => {
    if (address.id === updatedAddress.id) {
      return {
        ...address,
        type: newType,
        isPrimary: newType === ADDRESS_TYPE.PRIMARY,
      };
    }

    if (address.type === newType) {
      return { ...address, type: ADDRESS_TYPE.OTHER, isPrimary: false };
    }

    return address;
  });

  return {
    ...user,
    addresses: updatedAddresses,
  };
};
