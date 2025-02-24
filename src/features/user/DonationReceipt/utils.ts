import type { Address, User } from '@planet-sdk/common';
import type {
  AddressView,
  ReceiptData,
  ReceiptDataAPI,
} from './donationReceiptTypes';

export const RECEIPT_STATUS = {
  VERIFY: 'verify',
  DOWNLOAD: 'download',
  ISSUE: 'issue',
} as const;

export const formatReceiptData = (
  data: Partial<ReceiptDataAPI>,
  prevState: ReceiptData
): ReceiptData => {
  return {
    dtn: data.dtn ?? prevState.dtn,
    year: data.year ?? prevState.year,
    challenge: data.challenge ?? prevState.challenge,
    amount: data.amount ?? prevState.amount,
    currency: data.currency ?? prevState.currency,
    verificationDate: data.verificationDate ?? prevState.verificationDate,
    downloadUrl: data.downloadUrl ?? prevState.downloadUrl,
    donor: {
      tin: data.donor?.tin ?? prevState.donor.tin,
      name: data.donor?.name ?? prevState.donor.name,
      type: data.donor?.type ?? prevState.donor.type,
      email: data.donor?.email || prevState.donor.email,
    },
    address: {
      city: data.donor?.city ?? prevState.address.city,
      country: data.donor?.country ?? prevState.address.country,
      zipCode: data.donor?.zipCode ?? prevState.address.zipCode,
      address1: data.donor?.address1 ?? prevState.address.address1,
      address2: data.donor?.address2 ?? prevState.address.address2,
      guid: data.donor?.guid ?? prevState.address.guid,
    },
    donations: data.donations ?? prevState.donations,
    hasDonorDataChanged:
      data.hasDonorDataChanged ?? prevState.hasDonorDataChanged,
    operation:
      data.verificationDate === undefined || data.verificationDate === null
        ? 'verify'
        : 'download',
  };
};

export const getVerificationDate = () => {
  const isoDate = new Date().toISOString();
  const verificationDate = isoDate.replace('T', ' ').split('.')[0];
  return verificationDate;
};

/**
 * Compares the receipt address with the profile address to determine if they match.
 * Since the receipt address lacks a GUID, it performs a field-by-field comparison.
 * (Note: The GUID is only available once the donor has completed the process on the donor contact management page.)
 *
 * @param profileAddress - The address stored in the user's profile.
 * @param receiptAddress - The receipt address to be compared.
 * @returns {boolean} - Returns `true` if both addresses match, otherwise `false`.
 */
export const isMatchingAddress = (
  profileAddress: Address,
  receiptAddress: AddressView | undefined
) => {
  if (!receiptAddress) return false;
  const { guid: _guid, ...filteredReceiptAddress } = receiptAddress;
  return Object.entries(filteredReceiptAddress).every(([key, value]) => {
    const mappedKey = key === 'address1' ? 'address' : key;
    return profileAddress[mappedKey as keyof Address] === value;
  });
};

/**
 * Retrieves updated donor details, including the donor's name and address information.
 *
 * @param {User} res - The user object containing donor information, including addresses.
 * @param {Address[]} donorAddresses - The list of donor addresses associated with the user.
 * @param {string | null} addressGuid - The unique identifier for the address to retrieve.
 * @returns {{
 *   name: string;
 *   address1: string;
 *   address2: string | null;
 *   zipCode: string;
 *   city: string;
 *   country: string;
 *   tin: string | null;
 * }} - An object containing the donor's name, tax identification number (TIN), and the details of the specified address.
 *
 * - If the user is an individual, the donor name is constructed from `firstname` and `lastname`.
 * - If the user is an organization, the donor name is taken from `name`, defaulting to an empty string if not provided.
 * - The address is retrieved using the provided `addressGuid`. If no matching address is found, default values (empty strings or `null`) are returned for the address fields.
 * - The donor's TIN is included if available; otherwise, `null` is returned.
 */
export const getUpdatedDonorDetails = (
  res: User,
  addressGuid: string | null
) => {
  const name =
    res.type === 'individual'
      ? `${res.firstname} ${res.lastname}`
      : res.name ?? '';
  const donorAddress = res.addresses.find(
    (address) => address.id === addressGuid
  );

  return {
    name,
    address1: donorAddress?.address ?? '',
    address2: donorAddress?.address2 ?? null,
    zipCode: donorAddress?.zipCode ?? '',
    city: donorAddress?.city ?? '',
    country: donorAddress?.country ?? '',
    tin: res.tin ?? null,
  };
};
