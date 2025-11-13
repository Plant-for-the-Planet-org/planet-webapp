import type { Point, Polygon } from 'geojson';
import type { DateString } from './common';
import type {
  CountryCode,
  EcosystemTypes,
  TreeProjectClassification,
} from '@planet-sdk/common';
import type { ClusterProperties } from 'supercluster';

export type ContributionStats = {
  giftsReceivedCount: number;
  contributionsMadeCount: number;
  treesRegistered: number;
  treesDonated: {
    personal: number;
    received: number;
  };
  areaRestoredInM2: {
    personal: number;
    /** not currently needed, but included for consistency. Gifts with units 'm2' are not currently supported. Initialize as 0.  */
    received: 0;
  };
  areaConservedInM2: {
    personal: number;
    /** not currently needed but included for consistency. Gifts with units 'm2' are not currently supported. Initialize as 0. */
    received: 0;
  };
};

export type MyContributionsMapItem =
  | MyContributionsSingleProject
  | MyContributionsSingleRegistration;

export type MyContributionsSingleProject = {
  type: 'project';
  contributionCount: number;
  contributionUnitType: 'tree' | 'm2';
  /** Gifts received or donations made (including gifts given)  */
  totalContributionUnits: number;
  latestContributions: MySingleContribution[];
  latestGifts?: SingleGiftReceived[];
  latestDonations?: SingleDonation[];
};

export type MySingleContribution =
  | SingleDonation
  | SingleGiftGiven
  | SingleGiftReceived;

export type SingleContributionBase = {
  quantity: number;
  plantDate: DateString;
  unitType: 'tree' | 'm2';
};

export type SingleDonation = SingleContributionBase & {
  dataType: 'donation';
  isGifted: false;
  giftDetails: null;
};

export type SingleGiftGiven = SingleContributionBase & {
  dataType: 'issuedGift';
  isGifted: true;
  giftDetails: GiftGivenDetails | null;
};

export type GiftGivenDetails = {
  recipientName: string | null;
};

export type SingleGiftReceived = SingleContributionBase & {
  dataType: 'receivedGift';
  isGifted: true;
  giftDetails: GiftReceivedDetails | null;
};

export type GiftReceivedDetails = {
  giverName: string | null;
};

export type MyContributionsSingleRegistration = {
  type: 'registration';
  totalRegisteredUnits: number;
  registeredUnitType: 'tree';
  registeredCount: number;
  country: CountryCode | null;
  projectGuid: string | null;
  registrations: SingleRegistration[];
};

export type SingleRegistration = {
  dataType: 'treeRegistration';
  quantity: number;
  plantDate: DateString;
  unitType: 'tree';
};

export type MapLocation = {
  geometry: Point;
};

export type ProjectQueryResult = {
  guid: string;
  name: string;
  slug: string;
  classification: TreeProjectClassification | null;
  ecosystem: Exclude<EcosystemTypes, 'tropical-forests' | 'temperate'> | null;
  purpose: 'trees' | 'conservation';
  unitType: 'tree' | 'm2';
  country: CountryCode;
  geometry: Point;
  image: string;
  allowDonations: 0n | 1n | '0' | '1';
  tpoName: string;
};

export type MyForestProject = Omit<ProjectQueryResult, 'allowDonations'> & {
  allowDonations: boolean;
};

export type ProfileGroupQueryResult = {
  profileId: number;
};

export type BriefProjectQueryResult = {
  id: string;
  guid: string;
  purpose: 'trees' | 'conservation';
  country: string;
  geometry: Point | null;
};

export type ContributionsQueryResult = {
  guid: string;
  units: number;
  unitType: 'tree' | 'm2';
  plantDate: DateString;
  contributionType: 'donation';
  projectId: string;
  amount: number;
  currency: string;
  geometry: Point | Polygon | null;
  country: CountryCode | '';
  giftMethod: string | null;
  isSelfGift: boolean | null;
  giftRecipient: string | null;
  giftType: string | null;
};

export type RegistrationsQueryResult = {
  guid: string;
  units: number;
  plantDate: DateString;
  projectId: string;
  country: CountryCode | '';
  geometry: Point | Polygon | null;
};

export type GiftsQueryResult = {
  quantity: number;
  giftGiver: string;
  projectGuid: string;
  projectName: string;
  country: string;
  plantDate: DateString;
};

// Procedure Response types
interface ContributionsResponse {
  stats: ContributionStats;
  myContributionsMap: Map<string, MyContributionsMapItem>;
  registrationLocationsMap: Map<string, MapLocation>;
  projectLocationsMap: Map<string, MapLocation>;
}

type ProjectListResponse = Record<string, MyForestProject>;

// TODO: Could probably rename this to something more descriptive, similar to the other types for API response
export type LeaderboardItem = {
  name: string;
  units: number;
  unitType: 'tree' | 'm2';
  purpose: string;
};

export type Leaderboard = {
  mostRecent: LeaderboardItem[];
  mostTrees: LeaderboardItem[];
};

export interface DonationProperties {
  projectInfo: MyForestProject;
  contributionInfo: MyContributionsSingleProject;
}
export type DonationSuperclusterProperties =
  | DonationProperties
  | ClusterProperties;

export type RegistrationSuperclusterProperties =
  | MyContributionsSingleRegistration
  | ClusterProperties;
export type ProfilePageType = 'private' | 'public';
