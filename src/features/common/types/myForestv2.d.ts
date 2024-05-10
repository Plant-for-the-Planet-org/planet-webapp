import { Point } from 'geojson';
import { DateString } from './common';

export type ContributionStats = {
  giftCount: number;
  contributionCount: number;
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

export type ContributionsMapItem =
  | ContributionsMapSingleDonation
  | ContributionsMapSingleRegistration;

export type ContributionsMapSingleDonation = {
  type: 'contribution';
  totalContributionUnits: number;
  contributionUnitType: 'tree' | 'm2';
  contributionCount: number;
  contributions: ContributionData[];
};

export type ContributionData = DonationData | GiftData;

export type DonationData = {
  dataType: 'donation';
  quantity: number;
  plantDate: DateString;
  unitType: 'tree' | 'm2';
  isGifted: boolean;
  giftDetails: GiftGivenDetails | null;
  quantity: number;
};

export type GiftGivenDetails = {
  recipient: string | null;
  type: string | null;
};

export type GiftData = {
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

export type ContributionsMapSingleRegistration = {
  type: 'registration';
  totalContributionUnits: number;
  contributionUnitType: 'tree';
  contributionCount: number;
  contributions: RegistrationData[];
};

export type RegistrationData = {
  dataType: 'treeRegistration';
  quantity: number;
  plantDate: DateString;
  unitType: 'tree';
};

export type RegistrationLocation = {
  geometry: Point;
};

export type GroupTreecounterQueryResult = {
  profileId: number;
};

export type BriefProjectQueryResult = {
  id: string;
  guid: string;
  purpose: 'trees' | 'conservation';
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
  geometry: Point | null;
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
