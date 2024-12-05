
export interface DonationReceiptsStatusResponse {
    issued: IssuedDonationReceiptApi[];
    pending: PendingDonationReceiptApi[];
}

export interface IssuedDonationReceiptApi {
    amount: number;
    challenge: string;
    country: string;
    currency: string;
    donationCount: number;
    donations: IssuedDonationApi[];
    donor: DonorApi
    downloadUrl: string;
    dtn: string;
    paymentDate: string;
    reference: string;
    tinIsRequired: boolean | null;
    verificationDate: string | null;
    year: string;
}

export interface PendingDonationReceiptApi {
    // country: string;
    amount: number;
    currency: string;
    donations: PendingDonationApi[];
    donationCount: number;
    paymentDate: string;
    reference: string;
    template: string;
    tinIsRequired: boolean | null;
    uids: string[];
    verificationDate: string | null;
}

export interface IssuedDonationApi {
    reference: string;
    amount: number;
    currency: string;
    paymentDate: string;
}

export interface IssuedDonationView {
    reference: string;
    amount: number;
    currency: string;
    paymentDate: string;
}

export interface DonorApi {
    address1: string;
    address2: string | null;
    city: string;
    country: string;
    email: string;
    name: string;
    reference: string;
    tin: string | null;
    type: string; // e.g., "individual" or "organization"
    zipCode: string;
}

export interface PendingDonationApi {
    uid: string;
    amount: number;
    currency: string;
    paymentDate: string;
    purpose: string;
    isEndowment: boolean;
    year: number;
    country: string;
}


export interface PendingDonationView {
    reference: string;
    amount: number;
    currency: string;
    paymentDate: string;
}

export interface DonorView {
    name: string | null;
    tin: string | null;
    type: string | null;
}

export interface AddressView {
    city: string | null;
    zipCode: string | null;
    address1: string | null;
    address2: string | null;
    country: string | null;
}
