import type {
    PendingDonationApi,
    PendingDonationView,
    DonorApi,
    DonorView,
    AddressView,
    IssuedDonationApi, IssuedDonationView
} from './index'

export const transformDonationReceiptItem = (
    item: PendingDonationApi
): PendingDonationView => ({
    reference: item.uid,
    amount: item.amount,
    currency: item.currency,
    paymentDate: item.paymentDate,
});

export const transformIssuedDonation = (
    item: IssuedDonationApi
): IssuedDonationView => ({
    reference: item.reference,
    amount: item.amount,
    currency: item.currency,
    paymentDate: item.paymentDate,
});

export const transformDonor = (
    donor: DonorApi
): DonorView => ({
    name: donor.name || null,
    tin: donor.tin || null,
    type: donor.type || null,
});

export const transformAddress = (
    donor: DonorApi
): AddressView => ({
    city: donor.city || null,
    zipCode: donor.zipCode || null,
    address1: donor.address1 || null,
    address2: donor.address2 || null,
    country: donor.country || null,
});