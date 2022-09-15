declare namespace Payouts {
  export interface BankAccount {
    id: string;
    currency?: string;
    payoutMinAmount: number;
    bankName: string;
    bankAddress: string;
    routingNumber: string;
    bic: string;
    branchCode: string | null;
    holderName: string;
    holderAddress: string;
    accountNumber: string;
    holderType: string;
    remarks: string | null;
  }

  interface PayoutMinAmounts {
    [key: string]: number; //key will be 'CHF', 'EUR' etc.
  }
}
