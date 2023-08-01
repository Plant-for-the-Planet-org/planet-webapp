import { CountryCode } from '@planet-sdk/common/build/types/country';
import {
  ConservationProjectExtended,
  TreeProjectExtended,
} from '@planet-sdk/common/build/types/project/extended';

export interface ProjectOption {
  guid: string;
  slug: string;
  name: string;
  unitCost: number;
  currency: string;
  unit?: string;
  purpose: string;
  allowDonations: boolean;
}

export interface SingleProjectGeojson {
  geometry: Geometry;
  type: string;
  properties: Properties;
}

export interface Geometry {
  coordinates: number[][][];
  type: string;
}

export interface Properties {
  lastUpdated: LastUpdated;
  name: string;
  description: string;
  id: string;
  status: string;
}

export interface LastUpdated {
  date: string;
  timezone: string;
  timezone_type: number;
}

export interface ProfileProjectConservation
  extends Omit<
    ConservationProjectExtended,
    | '_scope'
    | 'certificates'
    | 'fixedRates'
    | 'images'
    | 'isPublished'
    | 'lastUpdated'
    | 'minQuantity'
    | 'options'
    | 'sites'
    | 'taxDeductionCountries'
    | 'yearAcquired'
    | 'treeCost'
    | 'coordinates'
    | 'expenses'
    | 'geoLocation'
    | 'reviews'
    | 'tpo'
  > {
  publish: boolean;
  taxDeductibleCountries: CountryCode[];
  isFeatured: boolean;
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  acceptDonations: boolean;
  geoLongitude: number;
  geoLatitude: number;
  isApproved: boolean;
  isTopProject: boolean;
  classification: null;
}

export interface ProfileProjectTrees
  extends Omit<
    TreeProjectExtended,
    | '_scope'
    | 'certificates'
    | 'fixedRates'
    | 'images'
    | 'isPublished'
    | 'lastUpdated'
    | 'minQuantity'
    | 'options'
    | 'sites'
    | 'taxDeductionCountries'
    | 'yearAcquired'
    | 'coordinates'
    | 'countDonated'
    | 'countPlanted'
    | 'countRegistered'
    | 'expenses'
    | 'geoLocation'
    | 'isCertified'
    | 'location'
    | 'minTreeCount'
    | 'paymentDefaults'
    | 'reviews'
    | 'tpo'
    | 'degradationCause'
    | 'degradationYear',
    | 'employeesCount'
    | 'longTermPlan'
    | 'mainChallenge'
    | 'motivation'
    | 'plantingDensity'
    | 'plantingSeasons'
    | 'siteOwnerName'
    | 'yearAbandoned'
  > {
  publish: boolean;
  taxDeductibleCountries: CountryCode[];
  isFeatured: boolean;
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  acceptDonations: boolean;
  geoLongitude: number;
  geoLatitude: number;
  revisionPeriodicityLevel: null;
}

type VerificationStatus =
  | 'incomplete'
  | 'accepted'
  | 'processing'
  | 'denied'
  | 'pending';
