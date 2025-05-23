import type { User } from '@planet-sdk/common/build/types/user';
import type {
  DonorApi,
  DonorView,
  AddressView,
  IssuedDonationApi,
  DonationView,
  UnissuedDonationApi,
} from './donationReceiptTypes';
import type { Address } from '@planet-sdk/common';
import { ADDRESS_TYPE } from '../../../utils/addressManagement';

export const transformIssuedDonation = (
  item: IssuedDonationApi
): DonationView => ({
  reference: item.reference,
  amount: item.amount,
  currency: item.currency,
  paymentDate: item.paymentDate,
});

export const transformUnissuedDonation = (
  item: UnissuedDonationApi
): DonationView => ({
  reference: item.uid,
  amount: item.amount,
  currency: item.currency,
  paymentDate: item.paymentDate,
});

export const transformDonor = (
  donor: DonorApi & { firstname?: string; lastname?: string }
): DonorView => ({
  name: donor.name ?? null,
  tin: donor.tin ?? null,
  type:
    donor.type === 'individual' || donor.type === 'organization'
      ? donor.type
      : null,
});

export const transformAddress = (donor: DonorApi): AddressView => ({
  city: donor.city || null,
  zipCode: donor.zipCode || null,
  address1: donor.address1 || null,
  address2: donor.address2 || null,
  country: donor.country || null,
});

export const transformProfileToDonorView = (user: User): DonorView => ({
  name:
    user.type === 'individual'
      ? `${user.firstname ?? ''} ${user.lastname ?? ''}`.trim()
      : user.name ?? null,
  tin: user.tin ?? null,
  type:
    user.type === 'individual' || user.type === 'organization'
      ? user.type
      : null,
});

const getPrimaryAddress = (user: User): Address | null => {
  return (
    user.addresses?.find((address) => address.type === ADDRESS_TYPE.PRIMARY) ??
    null
  );
};

export const transformProfileToPrimaryAddressView = (
  user: User
): AddressView | null => {
  const primaryAddress = getPrimaryAddress(user);

  if (!primaryAddress) {
    console.warn('No primary address found for user.');
    return null;
  }

  return {
    city: primaryAddress.city || null,
    zipCode: primaryAddress.zipCode || null,
    address1: primaryAddress.address || null,
    address2: primaryAddress.address2 || null,
    country: primaryAddress.country || null,
  };
};

export const transformProfileToPrimaryAddressGuid = (
  user: User
): string | null => {
  const primaryAddress = getPrimaryAddress(user);
  return primaryAddress?.id ?? null;
};
