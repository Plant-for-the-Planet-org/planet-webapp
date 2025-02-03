import type { User } from '@planet-sdk/common';
import type { ReceiptDataAPI, ReceiptData, AddressView } from './donorReceipt';

export const RECEIPT_STATUS = {
  VERIFY: 'verify',
  DOWNLOAD: 'download',
  ISSUE: 'issue',
} as const;

export const formatReceiptData = (
  data: Partial<ReceiptDataAPI>
): ReceiptData => {
  return {
    dtn: data.dtn || '',
    year: data.year || '',
    challenge: data.challenge || '',
    amount: data.amount || 0,
    currency: data.currency || '',
    paymentDate: data.paymentDate || '',
    verificationDate: data.verificationDate || null,
    downloadUrl: data.downloadUrl || '',
    donationCount: data.donationCount || 0,
    operation:
      data.verificationDate === null
        ? RECEIPT_STATUS.VERIFY
        : RECEIPT_STATUS.DOWNLOAD,
    donor: {
      tin: data.donor?.tin || null,
      name: data.donor?.name || '',
      type: data.donor?.type || null,
    },
    address: {
      city: data.donor?.city || '',
      country: data.donor?.country || '',
      zipCode: data.donor?.zipCode || '',
      address1: data.donor?.address1 || '',
      address2: data.donor?.address2 || null,
    },
    issuedDonations: data.donations || null,
    hasDonorDataChanged: false,
  };
};

export const getVerificationDate = () => {
  const isoDate = new Date().toISOString();
  const verificationDate = isoDate.replace('T', ' ').split('.')[0];
  return verificationDate;
};

/**
 * Compares the receipt address with the profile address to determine if they match.
 * Since the receipt address lacks a GUID, it checks for a field-by-field match.
 *
 * @param profileAddress - The address stored in the user's profile.
 * @param receiptAddress - The receipt address to be compared.
 * @returns {boolean} - Returns `true` if both addresses match, otherwise `false`.
 */
export const isMatchingAddress = (
  profileAddress: Record<string, any>,
  receiptAddress: AddressView | undefined
) => {
  if (!receiptAddress) return false;
  return Object.entries(receiptAddress).every(
    ([key, value]) =>
      profileAddress[key === 'address1' ? 'address' : key] === value
  );
};

/**
 * Extracts donor details and address information from a user object.
 *
 * @param {User} res - The user object containing donor information, including addresses.
 * @param {string} addressGuid - The unique identifier for the address to retrieve.
 * @returns {{
 *   donorName: string;
 *   address1: string;
 *   address2: string;
 *   zipCode: string;
 *   city: string;
 *   country: string;
 * }} - An object containing the donor's name and the details of the specified address.
 *
 * - If the user is an individual, the donor name is derived from `firstname` and `lastname`.
 * - If the user is an organization, the donor name is taken from `name`, defaulting to an empty string if not provided.
 * - The address is retrieved based on the provided `addressGuid`, and if no matching address is found, default empty strings are returned for address fields.
 */

export const getUpdatedDonorDetails = (res: User, addressGuid: string) => {
  const donorName =
    res.type === 'individual'
      ? `${res.firstname} ${res.lastname}`
      : res.name ?? '';
  const donorAddress = res.addresses.find(
    (address) => address.id === addressGuid
  );

  return {
    donorName,
    address1: donorAddress?.address ?? '',
    address2: donorAddress?.address2 ?? '',
    zipCode: donorAddress?.zipCode ?? '',
    city: donorAddress?.city ?? '',
    country: donorAddress?.country ?? '',
  };
};
