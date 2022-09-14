declare namespace PlanetCash {
  export interface Account {
    id: string;
    ownerName: string;
    balance: number;
    debit: number;
    creditLimit: number;
    currency: string; //'EUR';
    country: string; //'DE';
    topUpThreshold: number;
    topUpAmount: number;
    isActive: boolean;
    fee: number;
  }
}
