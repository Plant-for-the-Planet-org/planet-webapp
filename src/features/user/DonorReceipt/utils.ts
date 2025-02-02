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
