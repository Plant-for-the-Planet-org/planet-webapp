import { ConservationProjectMetadata, TreeProjectMetadata } from "@planet-sdk/common"
import { FeatureCollection as GeoJson } from 'geojson';
import { SetState } from "./common";
import {ChangeEvent} from 'react'
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

// project media

interface ProjectMediaProps {
  handleBack: (arg: number) => void;
  token: string;
  handleNext: (arg: number) => void;
  projectDetails: Project;
  setProjectDetails: SetState<Project>;
  projectGUID: String;
  handleReset:(arg: string) => void;
}


// Detail Analysis

export interface DetailedAnalysisProps {
  handleBack: (arg: number) => void;
  userLang: String;
  token: string;
  handleNext: (arg: number) => void;
  projectDetails: Project;
  setProjectDetails: SetState<Project>;
  projectGUID: String;
  handleReset: (arg: string) => void;
  purpose: String;
}
export interface SiteOwners {
  id: number;
  title: string;
  value: string;
  isSet: boolean;
}

export interface PlantingSeason {
  id: number;
  title: string;
  isSet: boolean;
}


// project site types


export interface ProjectSitesProps {
  handleBack: (arg: number) => void;
  token: string;
  handleNext: (arg: number) => void;
  projectGUID: String;
  handleReset: (arg: string) => void;
  projectDetails: Project;
}
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

export interface GeoLocation {
  geoLatitude: number;
  geoLongitude: number;
}

interface EditSiteProps {
  openModal: boolean;
  handleModalClose: ()=> void;
  changeSiteDetails: (e: ChangeEvent<HTMLInputElement>) => void;
  siteDetails: SiteDetails;
  status: string;
  geoJsonProp: GeoJson;
  ready: boolean;
  projectGUID: string;
  setSiteList: SetState<SiteList>;
  token: string;
  setFeatures: Function;
  seteditMode: Function;
  siteGUID: string;
  siteList: SiteList;
}

// project spending
export interface ProjectSpendingProps {
  handleBack: (arg: number) => void;
  token: string;
  handleNext: (arg: number) => void;
  userLang: String;
  projectGUID: String;
  handleReset: (arg: string) => void;
}

export interface UploadedFiles {
  amount: number;
  id: string;
  pdf: string;
  year: number
}

// project review

export interface SubmitForReviewProps {
  submitForReview:  () => Promise<void>;
  handleBack: (arg: number) => void;
  isUploadingData: Boolean;
  projectGUID: string;
  handleReset:  (arg: string) => void;
  projectDetails: Project;
  handlePublishChange: (arg: boolean) => Promise<void>;
}


// Project certificate


interface ProjectCertificatesProps {
  projectGUID: String;
  token: string;
  setIsUploadingData: Function;
  userLang: String;
}

interface CertificateUploaded {
  certifierName: string;
  id: string;
  issueDate : string;
  pdf: string
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