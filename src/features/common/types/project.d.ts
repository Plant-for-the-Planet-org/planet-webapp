import { ConservationProjectMetadata, TreeProjectMetadata } from "@planet-sdk/common"
import { FeatureCollection as GeoJson } from 'geojson';
import { SetState } from "./common";
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

// basic Detail

export interface BasicDetailsProps {
  handleNext: (arg: number) => void;
  projectDetails: Project;
  setProjectDetails: SetState<Project>;
  setProjectGUID: SetState<string>;
  projectGUID: string;
  token: string;
  purpose: String;
}

// project media types

export interface SiteDetails {
  geometry: {};
  name: string;
  status: string;
}

export interface SiteList {
  id: String;
  name: String;
  status: String;
  geometry: Object;
}

export interface Viewport {
  height: number;
  width: number;
  center: number[];
  zoom: number[];
}

export interface ProjectSitesProps {
  handleNext: (arg: number) => void;
  handleBack: (arg: number) => void;
  projectGUID: String;
  handleReset: (arg: string) => void;
  token: string;
  projectDetails: object;
}

export interface GeoLocation {
  geoLatitude: number;
  geoLongitude: number;
}

interface EditSiteProps {
  openModal: boolean;
  handleModalClose: Function;
  changeSiteDetails: Function;
  siteDetails: SiteDetails;
  status: string;
  geoJsonProp: GeoJson;
  ready: boolean;
  projectGUID: string;
  setSiteList: Function;
  token: string;
  setFeatures: Function;
  seteditMode: Function;
  siteGUID: string;
  siteList: SiteList;
}

// project spending
export interface ProjectSpendingProps {
  handleNext: (arg: number) => void;
  handleBack: (arg: number) => void;
  handleReset: (arg: string) => void;
  projectGUID: String;
  token: string;
  userLang: String;
}

export interface UploadedFiles {
  amount: number;
  id: string;
  pdf: string;
  year: number
}

// project review

export interface SubmitForReviewProps {
  handleBack: (arg: number) => void;
  submitForReview: Function;
  isUploadingData: Boolean;
  projectGUID: string;
  handleReset:  (arg: string) => void;
  projectDetails: Project;
  handlePublishChange: Function;
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