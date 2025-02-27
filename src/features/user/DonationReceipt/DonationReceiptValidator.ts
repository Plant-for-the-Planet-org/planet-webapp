import type { User } from '@planet-sdk/common';
import type { DonorView, AddressView } from './donationReceiptTypes';

/**
 * If a user is logged in, check if the user has a TIN.
 * If no user is logged in, check if the donor has a TIN.
 */
const validateTIN = (
  donor: DonorView,
  tinIsRequired: boolean,
  user: User | null
): boolean => {
  if (!tinIsRequired) return true;

  return Boolean(user ? !!user.tin : !!donor?.tin);
};

const validateAddress = (address: AddressView | null): boolean => {
  return Boolean(
    address?.address1 && address?.city && address?.zipCode && address?.country
  );
};

export const validateOwnership = (
  issuedToEmail: string | null,
  user: User | null
): boolean => {
  if (!user) return true;
  if (!issuedToEmail) return false;
  return user.email.toLowerCase() === issuedToEmail.toLowerCase();
};

export const validateIssuedReceipt = (
  donor: DonorView,
  address: AddressView | null,
  tinIsRequired: boolean,
  user: User | null
): boolean => {
  return validateTIN(donor, tinIsRequired, user) && validateAddress(address);
};

export const validateUnissuedReceipt = (
  donor: DonorView,
  address: AddressView | null,
  tinIsRequired: boolean,
  addressGuid: string | null,
  user: User | null
): boolean => {
  return (
    validateTIN(donor, tinIsRequired, user) &&
    validateAddress(address) &&
    !!addressGuid
  );
};
