import type {
  AllowedSeasonMonths,
  SiteOwnerTypes,
  Image,
  ProjectExpense,
  InterventionTypes,
  Certificate,
  UnitTypes,
  ProfileProjectPropertiesTrees,
  ProfileProjectPropertiesConservation,
} from '@planet-sdk/common';
import type { FeatureCollection as GeoJson } from 'geojson';
import type { SetState } from './common';
import type { ChangeEvent } from 'react';
import type { ViewportFlyToInterpolator } from 'react-map-gl/src/utils/transition/viewport-fly-to-interpolator';
import type { Nullable } from '@planet-sdk/common/build/types/util';
import type { Polygon } from 'geojson';

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

type VerificationStatus =
  | 'incomplete'
  | 'accepted'
  | 'processing'
  | 'denied'
  | 'pending';

export interface ExtendedProfileProjectPropertiesTrees
  extends Omit<
    ProfileProjectPropertiesTrees,
    | 'isPublished'
    | 'countTarget'
    | 'treeCost'
    | 'unit'
    | 'paymentDefaults'
    | 'location'
    | 'minTreeCount'
    | 'countPlanted'
    | 'tpo'
    | 'reviews'
  > {
  //TODO: Remove these from the root level of the response
  acquisitionYear: null;
  enableInterventions: null;
  firstTreePlanted: null;
  plantingSeasons: Nullable<AllowedSeasonMonths[]>;
  siteOwnerType: Nullable<SiteOwnerTypes[]>;
  visitorAssistance: Nullable<boolean>;

  publish: boolean;
  //TODO: verify is allowDonation and acceptDonations are the same
  acceptDonations: boolean;
  //TODO: Update the planet SDK to allow string or number (countTarget and treeCost)
  countTarget: string | number;
  geoLongitude: number;
  geoLatitude: number;
  isVerified: boolean;
  intensity: Nullable<string>;
  reviewRequested: boolean;
  revisionPeriodicityLevel: Nullable<string>;
  survivalRate: Nullable<number>;
  survivalRateStatus: Nullable<string>;
  treeCost: string | number;
  verificationStatus: VerificationStatus;
  videoUrl: Nullable<string>;
  website: Nullable<string>;
}

export interface ExtendedProfileProjectPropertiesConservation
  extends Omit<
    ProfileProjectPropertiesConservation,
    'unit' | 'tpo' | 'isPublished' | 'reviews' | 'countPlanted'
  > {
  countTarget: null;
  geoLatitude: number;
  geoLongitude: number;
  isVerified: boolean;
  acceptDonations: boolean;
  publish: boolean;
  reviewRequested: boolean;
  classification: null;
  verificationStatus: VerificationStatus;
  videoUrl: Nullable<string>;
  website: Nullable<string>;
}

export type ExtendedProfileProjectProperties =
  | ExtendedProfileProjectPropertiesConservation
  | ExtendedProfileProjectPropertiesTrees;

export type CertificateScopeProjects = ExtendedProfileProjectProperties & {
  _scope: string;
  certificates: Certificate[];
};

export type ImagesScopeProjects = ExtendedProfileProjectProperties & {
  _scope: string;
  images: UploadImage[];
};

export type ExpensesScopeProjects = ExtendedProfileProjectProperties & {
  _scope: string;
  expenses: ProjectExpense[];
};

export type SitesScopeProjects = ExtendedProfileProjectProperties & {
  _scope: string;
  sites: Site[];
};

export interface ManageProjectsProps {
  GUID?: string;
  token: string;
  project?: ExtendedProfileProjectProperties;
}

// basic Detail

export interface BasicDetailsProps {
  handleNext: (arg: number) => void;
  projectDetails: ExtendedProfileProjectProperties | null;
  setProjectDetails: SetState<ExtendedProfileProjectProperties | null>;
  setProjectGUID: SetState<string>;
  projectGUID: string;
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
  projectDetails: Nullable<ExtendedProfileProjectProperties>;
  setProjectDetails: SetState<ExtendedProfileProjectProperties | null>;
  projectGUID: string | unknown;
}

// Detail Analysis

export interface DetailedAnalysisProps {
  handleBack: (arg: number) => void;
  userLang: string;
  token: string;
  handleNext: (arg: number) => void;
  projectDetails: Nullable<ExtendedProfileProjectProperties>;
  setProjectDetails: SetState<ExtendedProfileProjectProperties | null>;
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
  projectDetails: Nullable<ExtendedProfileProjectProperties>;
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
  setEditMode: Function;
  siteGUID: Nullable<string>;
  siteList: Site[];
  tiles: string[];
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
  projectDetails: Nullable<ExtendedProfileProjectProperties>;
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
