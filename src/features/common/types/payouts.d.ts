export interface BankAccount {
  id: string;
  currency: string | null;
  payoutMinAmount: number | null;
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

export interface PayoutMinAmounts {
  [key: string]: number; //key will be 'CHF', 'EUR' etc.
}
