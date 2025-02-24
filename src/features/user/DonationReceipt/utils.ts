import type { Address, User } from '@planet-sdk/common';
import type {
  AddressView,
  DonorView,
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
  prevState: ReceiptData | undefined
): ReceiptData => {
  // If we have existing data, start with it as the base
  const baseData: Partial<ReceiptData> = prevState || {};

  // Extract basic fields that exist in both types
  const commonFields: Partial<ReceiptData> = {
    dtn: data.dtn ?? baseData.dtn ?? '',
    year: data.year ?? baseData.year ?? '',
    challenge: data.challenge ?? baseData.challenge ?? '',
    currency: data.currency ?? baseData.currency ?? '',
    amount: data.amount ?? baseData.amount ?? 0,
    verificationDate:
      data.verificationDate ?? baseData.verificationDate ?? null,
    downloadUrl: data.downloadUrl ?? baseData.downloadUrl ?? '',
    donations: data.donations ?? baseData.donations ?? [],
  };

  // Transform donor data if provided, otherwise keep existing
  const donorView: DonorView = {
    tin: data.donor?.tin ?? baseData.donor?.tin ?? null,
    name: data.donor?.name ?? baseData.donor?.name ?? '',
    type: data.donor?.type ?? baseData.donor?.type ?? null,
  };

  // Transform address data if provided, otherwise keep existing
  const addressView: AddressView = {
    city: data.donor?.city ?? baseData.address?.city ?? '',
    country: data.donor?.country ?? baseData.address?.country ?? '',
    zipCode: data.donor?.zipCode ?? baseData.address?.zipCode ?? '',
    address1: data.donor?.address1 ?? baseData.address?.address1 ?? '',
    address2: data.donor?.address2 ?? baseData.address?.address2 ?? null,
    guid: data.donor?.guid ?? baseData.address?.guid ?? null,
  };

  // Construct the final ReceiptData object
  return {
    ...commonFields,
    donor: donorView,
    address: addressView,
    hasDonorDataChanged:
      data.hasDonorDataChanged ?? baseData.hasDonorDataChanged ?? false,
    operation: data.verificationDate === null ? 'verify' : 'download',
  } as ReceiptData;
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
