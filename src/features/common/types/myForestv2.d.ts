import { Point, Polygon } from 'geojson';
import { DateString } from './common';

export type ContributionStats = {
  giftsReceivedCount: number;
  contributionsMadeCount: number;
  contributedProjects: Set<string>;
  contributedCountries: Set<string>;
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

export type MySingleContribution = SingleDonation | SingleGiftReceived;

export type SingleDonation = {
  dataType: 'donation';
  quantity: number;
  plantDate: DateString;
  unitType: 'tree' | 'm2';
  isGifted: boolean;
  giftDetails: GiftGivenDetails | null;
};

export type GiftGivenDetails = {
  recipient: string | null;
  type: string | null;
};

export type SingleGiftReceived = {
  dataType: 'receivedGift';
  quantity: number;
  plantDate: DateString;
  unitType: 'tree';
  isGift: true;
  giftDetails: GiftReceivedDetails;
};

export type GiftReceivedDetails = {
  giverName: string | null;
};

export type MyContributionsSingleRegistration = {
  type: 'registration';
  totalContributionUnits: number;
  contributionUnitType: 'tree';
  contributionCount: number;
  contributions: SingleRegistration[];
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

export type GroupTreecounterQueryResult = {
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
  contributionType: 'donation' | 'planting';
  projectId: string;
  amount: number;
  currency: string;
  geometry: Point | Polygon | null;
  country: string;
  giftMethod: string | null;
  giftRecipient: string | null;
  giftType: string | null;
};

export type GiftsQueryResult = {
  quantity: number;
  giftGiver: string;
  projectGuid: string;
  projectName: string;
  country: string;
  plantDate: DateString;
};

export type LeaderboardItem = {
  name: string;
  units: number;
  unitType: 'tree' | 'm2';
};

export type Leaderboard = {
  mostRecent: LeaderboardItem[];
  mostTrees: LeaderboardItem[];
};
