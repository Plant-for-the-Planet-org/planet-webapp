import {
  AllowedSeasonMonths,
  SiteOwnerTypes,
  Image,
  EcosystemTypes,
  LandOwnershipTypes,
  OwnershipTypes,
  SurvivalRateStatus,
  ProjectExpense,
  CountryCode,
  TreeProjectExtended,
  ConservationProjectExtended,
  InterventionTypes,
  Tpo,
  DefaultPaymentConfig,
  Certificate,
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
  expenses: ProjectExpense[]; //
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

interface ScopeProjects extends Project {
  _scope: string;
  unitType: string;
  unitsContributed: any;
  unitsTargeted: UnitsTargeted;
}

export interface CertificateScopeProjects
  extends Omit<ScopeProjects, 'sites' | 'images' | 'expenses'> {
  certificates: Certificate[];
}

export type ImagesScopeProjects = Omit<ScopeProjects, 'sites' | 'expenses'>;

export type ExpensesScopeProjects = Omit<Project, 'sites' | 'images'>;

export type SitesScopeProjects = Omit<Project, 'expenses' | 'images'>;
interface UnitsTargeted {
  tree: number;
}

export interface Properties {
  purpose: string;
  id: string;
  slug: string;
  name: string;
  allowDonations: boolean;
  country: string;
  currency: string;
  image: string;
  unit: string;
  unitType: string;
  unitCost: number;
  taxDeductionCountries: CountryCode[];
  isApproved: boolean;
  isTopProject: boolean;
  isFeatured: boolean;
  metadata: MetaData;
  tpo: Tpo;
  classification: string;
  countPlanted: number;
  minTreeCount: number;
  countTarget: number;
  location: string;
  treeCost: number;
  paymentDefaults: Nullable<DefaultPaymentConfig>;
}

export interface ManageProjectsProps {
  GUID?: string;
  token: string;
  project?: ProfileProjectTrees | ProfileProjectConservation;
}

// basic Detail

export interface BasicDetailsProps {
  handleNext: (arg: number) => void;
  projectDetails: ProfileProjectTrees | ProfileProjectConservation | null;
  setProjectDetails: SetState<
    ProfileProjectTrees | ProfileProjectConservation | null
  >;
  setProjectGUID: SetState<string>;
  projectGUID: string | unknown;
  token: string;
  purpose: 'trees' | 'conservation';
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
  projectDetails: ProfileProjectTrees | ProfileProjectConservation | null;
  setProjectDetails: SetState<
    ProfileProjectTrees | ProfileProjectConservation | null
  >;
  projectGUID: string | unknown;
}

// Detail Analysis

export interface DetailedAnalysisProps {
  handleBack: (arg: number) => void;
  userLang: string;
  token: string;
  handleNext: (arg: number) => void;
  projectDetails: ProfileProjectTrees | ProfileProjectConservation | null;
  setProjectDetails: SetState<
    ProfileProjectTrees | ProfileProjectConservation | null
  >;
  projectGUID: string;
  purpose: string | string[] | undefined;
}

export type InterventionOption = [InterventionTypes, boolean];

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
  projectDetails: ProfileProjectTrees | ProfileProjectConservation | null;
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
}

// project review

export interface SubmitForReviewProps {
  submitForReview: () => Promise<void>;
  handleBack: (arg: number) => void;
  isUploadingData: Boolean;
  projectDetails: ProfileProjectTrees | ProfileProjectConservation | null;
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
    | 'degradationYear'
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
