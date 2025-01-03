import type { Image } from '@planet-sdk/common';
import type { Geometry } from '@turf/turf';

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
