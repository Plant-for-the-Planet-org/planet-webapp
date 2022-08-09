// TO CHECK WITH JORGO - WHAT PARAMETERS ARE PRESENT, AND WHAT IS THEIR TYPE?
export interface PlanetCash {
  account: string;
  country: string;
  currency: string;
  balance: number;
  creditLimit: number;
}

export interface Score {
  personal: number;
  received: number;
  target: number;
}

export interface Address {
  address: string;
  city: string;
  zipCode: string;
  country: string;
}

export interface User {
  id: string;
  slug: string;
  type: string;
  currency: string | null;
  name: string | null;
  firstname: string;
  lastname: string;
  country: string;
  email: string;
  image: string | null;
  url: string | null;
  urlText: string | null;
  planetCash: PlanetCash | null;
  displayName: string;
  score: Score;
  supportedProfile: string;
  isReviewer: boolean;
  isPrivate: boolean;
  getNews: boolean;
  bio: string | null;
  address: Address;
  locale: string;
  hasLogoLicense: boolean | null;
  tin: string | null;
}
