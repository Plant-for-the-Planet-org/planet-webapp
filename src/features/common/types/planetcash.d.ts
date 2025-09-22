import type { Nullable } from '@planet-sdk/common/build/types/util';

export type PaymentMethodType = 'card' | 'sepa_debit';

export interface PaymentMethodInterface {
  id: string;
  type: PaymentMethodType;
  brand: string; //e.g. 'visa', 'mastercard', 'sepa';
  last4: string; //last 4 digits of card or iban in case of sepa;
}

export interface PlanetCashAccount {
  id: string;
  isActive: boolean;
  ownerName: string;
  balance: number;
  debit: number;
  fee: number;
  creditLimit: number;
  currency: string; //'EUR';
  country: string; //'DE';
  topUpThreshold: Nullable<number>;
  topUpAmount: Nullable<number>;
  temporaryCreditLimit: number;
  paymentMethods: Array<PaymentMethodType>;
}
