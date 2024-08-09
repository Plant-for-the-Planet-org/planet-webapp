import { Geometry } from '@turf/turf';
import { User } from '@planet-sdk/common';
import { PublicUser } from './user';

export interface Page {
  data: Contributions[];
  nextCursor: string | undefined;
}
export interface StatsParam {
  profileId: string;
}

export interface Stats {
  conserved: number;
  countries: number;
  donations: number;
  projects: number;
  squareMeters: number;
  treeCount: number;
}

interface Tpo {
  guid: string;
  name: string;
  id: string;
}
interface PlantProject {
  guid: string;
  name: string | null;
  image: string;
  country: string;
  unit: string;
  location: string | null;
  geoLatitude: number | null;
  geoLongitude: number | null;
  tpo: Tpo;
}
export interface GiftContributionProps {
  allowDonations: boolean;
  created: string;
  value: number;
  guid: string;
  recipient: Recipient;
  metadata: Metadata;
  purpose: string;
  type: string;
  _type: string;
  quantity: number;
}

export interface Recipient {
  id: number;
  guid: string;
  name: string | null;
}

export interface Metadata {
  giver: Giver;
  project: Project;
}

export interface Giver {
  name: string;
  slug: string;
  avatar: any;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  image: string;
  country: string;
  location: string;
  coordinates: number[];
  organization: Organization;
}

export interface Organization {
  name: string;
  slug: string;
}

export type BouquetContribution = Omit<Contributions, 'bouquetContributions'>;

interface Tenant {
  guid: string;
  name: string;
}

export interface Contributions {
  // procedure returns Contributions
  purpose: string | null;
  treeCount: number | null;
  quantity: number | null;
  tenant: Tenant;
  plantDate: number | Date | string;
  contributionType: string;
  bouquetContributions: BouquetContribution[] | undefined;
  plantProject: PlantProject;
  _type: 'contribution';
}

interface Properties {
  cluster: boolean;
  purpose: string;
  quantity: number;
  plantDate: number | Date;
  contributionType: string;
  plantProject: PlantProject;
}

interface PlantProject {
  allowDonations: boolean;
  guid: string;
  name: string | null;
  image: string;
  country: string;
  unit: string;
  location: string;
  geoLatitude: number;
  geoLongitude: number;
  tpo: Tpo;
}

interface Tpo {
  id: number;
  guid: string;
  name: string | null;
}

export interface DonationInfoProps {
  projects: number | null;
  countries: number | null;
  donations: number | null;
}

export interface ContributionStatsQueryResult {
  treeCount: number | null;
  squareMeters: number | null;
  conserved: number | null;
  projects: number | null;
  countries: number | null;
  donations: number | null;
}

export interface GiftStatsQueryResult {
  treeCount: number | null;
  conserved: number | null;
}

export interface CountryProjectStatsResult {
  projectId: string;
  country: string;
}

export interface StatsResult {
  treeCount: number;
  squareMeters: number;
  conserved: number;
  projects: number;
  countries: number;
  donations: number;
}

export interface ContributionsGeoJsonQueryResult {
  purpose: string;
  treeCount: number;
  quantity: number;
  contribution_type: string;
  location: string;
  country: string;
  unit_type: string;
  guid: string;
  name: string;
  image: string;
  geoLatitude: number;
  geoLongitude: number;
  geometry: Geometry | null;
  tpoName: string;
  startDate: string;
  endDate: string;
  totalContributions: number;
  allowDonations: boolean;
}

export interface GiftsGeoJsonQueryResult {
  type: string;
  purpose: string;
  value: string;
  created: Date;
  metadata: {
    giver: {
      name: string;
      slug: string;
      avatar: string | null;
    };
    project: {
      id: string;
      name: string;
      slug: string;
      country: string;
      location: string;
      coordinates: number[];
      organization: {
        name: string;
        slug: string;
      };
    };
    notificationLocale: string | null;
  };
}

export interface ContributionData {
  pageParams: [null, string] | [null];
  pages: Page[];
}
export interface TreeContributedProjectListProps {
  userProfile: User | PublicUser;
  handleFetchNextPage?: () => void;
  hasNextPage?: boolean | undefined;
}
