export interface Score {
  personal: number;
  received: number;
  target: number;
}

export interface Address {
  country: string;
}

export interface PlanetCash {
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

export interface UserProfile {
  id: string;
  slug: string;
  type: string;
  firstname: string;
  lastname: string;
  country: string;
  email: string;
  displayName: string;
  score: Score;
  isReviewer: boolean;
  isPrivate: boolean;
  getNews: boolean;
  address: Address;
  locale: string;
  planetCash: PlanetCash | null;
}
