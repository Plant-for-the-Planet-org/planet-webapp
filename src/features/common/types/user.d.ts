import { UserType, Score, Image } from '@planet-sdk/common';
import { Geometry } from '@turf/turf';

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

export interface ContributionType {
  type: string;
  geometry: Geometry;
  properties: ContributionProperties;
}
interface ContributionProperties {
  id: string;
  type: string;
  plantDate?: string;
  country: string;
  images: Image[];
  treeCount: number;
  unitType: string;
  project: ContributionProject;
  recipient?: PersonOrOrganization | null;
  giver?: PersonOrOrganization | null;
}
interface ContributionProject {
  name: string;
  slug: string;
  location?: string;
  category: string;
  owner: PersonOrOrganization;
}
interface PersonOrOrganization {
  name: string;
  slug: string;
  avatar?: string;
}
