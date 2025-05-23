import type {
  AllowedSeasonMonths,
  SiteOwnerTypes,
  Image,
  EcosystemTypes,
  LandOwnershipTypes,
  OwnershipTypes,
  ProjectExpense,
  CountryCode,
  TreeProjectExtended,
  ConservationProjectExtended,
  InterventionTypes,
  Tpo,
  DefaultPaymentConfig,
  Certificate,
  UnitTypes,
} from '@planet-sdk/common';
import type { FeatureCollection as GeoJson } from 'geojson';
import type { SetState } from './common';
import type { ChangeEvent } from 'react';
import type { ViewportFlyToInterpolator } from 'react-map-gl/src/utils/transition/viewport-fly-to-interpolator';
import type { Nullable } from '@planet-sdk/common/build/types/util';
import type { Polygon } from 'geojson';
import type { Option } from '../../user/ManageProjects/components/ProjectSites';

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

export type CertificateScopeProjects = ProfileProject & {
  _scope: string;
  certificates: Certificate[];
};

export type ImagesScopeProjects = ProfileProject & {
  _scope: string;
  images: UploadImage[];
};

export type ExpensesScopeProjects = ProfileProject & {
  _scope: string;
  expenses: ProjectExpense[];
};

export type SitesScopeProjects = ProfileProject & {
  _scope: string;
  sites: Site[];
};
interface Units {
  tree?: number;
  m2?: number;
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
  projectGUID: string;
  setSiteList: SetState<Site[]>;
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
  unitType?: UnitTypes;
  purpose: 'trees' | 'conservation' | 'funds';
  allowDonations: boolean;
}

export type ProfileProject = ProfileProjectConservation | ProfileProjectTrees;

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
    | 'yearAcquired'
    | 'treeCost'
    | 'coordinates'
    | 'expenses'
    | 'geoLocation'
    | 'reviews'
    | 'tpo'
  > {
  publish: boolean;
  isFeatured: boolean;
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  acceptDonations: boolean;
  geoLongitude: number;
  geoLatitude: number;
  isApproved: boolean;
  isTopProject: boolean;
  classification: null;
  unitsContributed: Units;
  unitsTargeted: Units;
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
    | 'siteOwnerName'
    | 'yearAbandoned'
  > {
  publish: boolean;
  isFeatured: boolean;
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  acceptDonations: boolean;
  geoLongitude: number;
  geoLatitude: number;
  revisionPeriodicityLevel: null;
  acquisitionYear: Nullable<number>;
  siteOwnerType: Nullable<SiteOwnerTypes[]>;
  unitsContributed: Units;
  unitsTargeted: Units;
}

type VerificationStatus =
  | 'incomplete'
  | 'accepted'
  | 'processing'
  | 'denied'
  | 'pending';
