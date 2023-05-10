import { ConservationProjectMetadata, TreeProjectMetadata } from "@planet-sdk/common"

export interface Project {
  name: string
  countTarget: number
  survivalRate: any
  unitCost: number
  currency: string
  country: string
  description: string
  videoUrl: string
  metadata: ConservationProjectMetadata | TreeProjectMetadata
  id: string
  website: string
  publish: boolean
  allowDonations: boolean
  taxDeductibleCountries: string[]
  slug: string
  purpose: string
  classification: string
  image: string
  isFeatured: boolean
  isVerified: boolean
  verificationStatus: string
  acceptDonations: boolean
  geoLongitude: number
  geoLatitude: number
  reviewRequested: boolean
  isApproved: boolean
  isTopProject: boolean
  plantingSeasons: string[]
  siteOwnerType: string[]
  enablePlantLocations: boolean
  survivalRateStatus: any
  treeCost: number
  visitorAssistance: boolean
  firstTreePlanted: number
  acquisitionYear: number
  intensity: any
  revisionPeriodicityLevel: any
}


export interface MapSingleProject {
  type: string;
  geometry: unknown;
  properties: {
    [index: string]: unknown;
    id: string;
    name: string;
    slug: string;
    allowDonations: boolean;
    purpose: string;
    currency: string;
    unitCost: number;
  };
}