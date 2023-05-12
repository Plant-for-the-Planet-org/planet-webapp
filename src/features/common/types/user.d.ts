import { UserType, Score } from '@planet-sdk/common';

// TODOO - add PublicUser type to common sdk
export interface PublicUser {
  id: string;
  slug: string;
  type: UserType;
  image?: string;
  url?: string;
  urlText?: string;
  displayName: string;
  score: Score;
  supportedProfile?: string;
  /** @deprecated do not use */
  isReviewer: boolean;
  bio?: string;
  /** @deprecated do not use */
  hasLogoLicense?: boolean;
}

export interface AddressSuggestionsType {
  isCollection: boolean;
  magicKey: string;
  text: string;
}
