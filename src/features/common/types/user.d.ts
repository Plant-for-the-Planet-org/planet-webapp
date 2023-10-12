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
  properties: Properties;
}
interface Properties {
  id: string;
  type: string;
  plantDate?: string;
  country: string;
  images: Image[];
  treeCount: number;
  unitType: string;
  project: Project;
  recipient?: Owner | null;
  giver?: Owner | null;
}
interface Project {
  name: string;
  slug: string;
  location?: string;
  category: string;
  owner: Owner;
}
interface Owner {
  name: string;
  slug: string;
  avatar?: string;
}
