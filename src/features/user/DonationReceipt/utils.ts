import type { ReceiptData, VerifiedReceiptDataAPI } from './donationReceipt';

export const RECEIPT_STATUS = {
  VERIFY: 'verify',
  DOWNLOAD: 'download',
  ISSUE: 'issue',
} as const;

export const formatReceiptData = (
  data: Partial<VerifiedReceiptDataAPI>
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
    donations: data.donations || [],
    hasDonorDataChanged: false,
    operation: data.downloadUrl ? 'download' : 'verify',
  };
};

export const getVerificationDate = () => {
  const isoDate = new Date().toISOString();
  const verificationDate = isoDate.replace('T', ' ').split('.')[0];
  return verificationDate;
};
