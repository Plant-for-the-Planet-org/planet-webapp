import {
  AllowedSeasonMonths,
  SiteOwnerTypes,
  Image,
  EcosystemTypes,
  LandOwnershipTypes,
  OwnershipTypes,
  SurvivalRateStatus,
  ProjectExpense,
} from '@planet-sdk/common';
import { FeatureCollection as GeoJson } from 'geojson';
import { SetState } from './common';
import { ChangeEvent } from 'react';
import { ViewportFlyToInterpolator } from 'react-map-gl/src/utils/transition/viewport-fly-to-interpolator';
import { Nullable } from '@planet-sdk/common/build/types/util';
import { Polygon } from 'geojson';
import { Option } from '../../user/ManageProjects/components/ProjectSites';

export interface UploadImage extends Image {
  isDefault: boolean;
}

export interface Site {
  description?: Nullable<string>;
  geometry: Polygon;
  id: string;
  name: string;
  status: string;
}

export interface MetaData {
  acquisitionYear: Nullable<number>;
  employeesCount: Nullable<number>;
  longTermPlan: Nullable<string>;
  mainChallenge: Nullable<string>;
  motivation: Nullable<string>;
  siteOwnerName: Nullable<string>;
  visitorAssistance: Nullable<boolean>;
  degradationCause: Nullable<string>;
  degradationYear: Nullable<number>;
  enablePlantLocations: Nullable<boolean>;
  /** This will be a string representing a date similar to the example here > 2021-07-01 00:00:00 */
  firstTreePlanted: Nullable<string>;
  location: Nullable<string>;
  maxPlantingDensity: Nullable<number>;
  plantingDensity: Nullable<number>;
  plantingSeasons: Nullable<AllowedSeasonMonths[]>;
  siteOwnerType: Nullable<SiteOwnerTypes[]>;
  yearAbandoned: Nullable<number>;
  actions?: Nullable<string>;
  activitySeasons?: Nullable<AllowedSeasonMonths[]>;
  areaProtected?: Nullable<number>;
  benefits?: Nullable<string>;
  coBenefits?: Nullable<string>;
  ecosystems?: Nullable<EcosystemTypes>;
  ecologicalBenefits?: Nullable<string>;
  landOwnershipType?: Nullable<LandOwnershipTypes[]>;
  ownershipType?: Nullable<OwnershipTypes>;
  socialBenefits?: Nullable<string>;
  startingProtectionYear?: Nullable<number>;
}
export interface Project {
  name: string;
  countTarget: number;
  survivalRate: any;
  unitCost: number;
  currency: string;
  country: string;
  description: string;
  videoUrl: string;
  metadata: MetaData;
  id: string;
  website: string;
  publish: boolean;
  allowDonations: boolean;
  taxDeductibleCountries: string[];
  slug: string;
  purpose: string;
  sites: Site[];
  classification: string;
  image: string;
  images: UploadImage[];
  isFeatured: boolean;
  isVerified: boolean;
  verificationStatus: string;
  acceptDonations: boolean;
  geoLongitude: number;
  geoLatitude: number;
  expenses: ProjectExpense[];
  reviewRequested: boolean;
  isApproved: boolean;
  isTopProject: boolean;
  plantingSeasons: string[];
  siteOwnerType: string[];
  enablePlantLocations: boolean;
  survivalRateStatus: SurvivalRateStatus;
  treeCost: number;
  visitorAssistance: boolean;
  firstTreePlanted: number;
  acquisitionYear: number;
  intensity: any;
  revisionPeriodicityLevel: any;
}

export interface ManageProjectsProps {
  GUID: string;
  token: string;
  project: Project;
}

// basic Detail

export interface BasicDetailsProps {
  handleNext: (arg: number) => void;
  projectDetails: Project | undefined;
  setProjectDetails: SetState<Project | undefined>;
  setProjectGUID: SetState<string>;
  projectGUID: string | unknown;
  token: string;
  purpose: string | string[] | undefined;
}

export interface ViewPort {
  width: number;
  height: number;
  latitude: number;
  longitude: number;
  zoom: number;
  transitionDuration?: number;
  transitionInterpolator?: ViewportFlyToInterpolator;
  transitionEasing?: (normalizedTime: number) => number;
}

// project media
export interface ProjectMediaProps {
  handleBack: (arg: number) => void;
  token: string;
  handleNext: (arg: number) => void;
  projectDetails: Project | undefined;
  setProjectDetails: SetState<Project | undefined>;
  projectGUID: string | unknown;
  handleReset: (arg: string) => void;
}

// Detail Analysis

export interface DetailedAnalysisProps {
  handleBack: (arg: number) => void;
  userLang: string;
  token: string;
  handleNext: (arg: number) => void;
  projectDetails: Project | undefined;
  setProjectDetails: SetState<Project | undefined>;
  projectGUID: string;
  handleReset: (arg: string) => void;
  purpose: string | string[] | undefined;
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
  projectGUID: string;
  handleReset: (arg: string) => void;
  projectDetails: Project;
}
export interface SiteDetails {
  geometry: {};
  name: string;
  status: string;
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

interface Option {
  label: string;
  value: string;
}
interface EditSiteProps {
  openModal: boolean;
  handleModalClose: () => void;
  changeSiteDetails: (e: ChangeEvent<HTMLInputElement>) => void;
  siteDetails: SiteDetails;
  status: Option[];
  geoJsonProp: GeoJson | null;
  ready: boolean;
  projectGUID: string;
  setSiteList: SetState<Site[]>;
  token: string;
  setFeatures: Function;
  seteditMode: Function;
  siteGUID: Nullable<string>;
  siteList: Site[];
}

// project spending
export interface ProjectSpendingProps {
  handleBack: (arg: number) => void;
  token: string;
  handleNext: (arg: number) => void;
  userLang: string;
  projectGUID: string | unknown;
  handleReset: (arg: string) => void;
}

// project review

export interface SubmitForReviewProps {
  submitForReview: () => Promise<void>;
  handleBack: (arg: number) => void;
  isUploadingData: Boolean;
  projectGUID: string;
  handleReset: (arg: string) => void;
  projectDetails: Project;
  handlePublishChange: (arg: boolean) => Promise<void>;
}

// Project certificate

interface ProjectCertificatesProps {
  projectGUID: string;
  token: string;
  setIsUploadingData: Function;
  userLang: string;
}

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
