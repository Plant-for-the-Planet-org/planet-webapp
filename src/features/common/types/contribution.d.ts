import { SetState } from './common';
import { User } from '@planet-sdk/common';

export interface StatsParam {
  profileId: string;
}

export interface Stats {
  conserved: number;
  countries: number;
  donations: number;
  projects: number;
  squareMeters: number;
  treeCount: number;
}

interface Tpo {
  guid: string;
  name: string;
}
interface PlantProject {
  guid: string;
  name: string | null;
  image: string;
  country: string;
  unit: string;
  location: any;
  geoLatitude: any;
  geoLongitude: any;
  tpo: any;
}

interface BouquetContribution {
  purpose: string | null;
  treeCount: number | null;
  quantity: number | null;
  plantDate: number | Date;
  contributionType: string;
  plantProject: PlantProject | null;
}

export interface Contributions {
  // procedure returns Contributions
  purpose: string | null;
  treeCount: number | null;
  quantity: number | null;
  plantDate: number | Date;
  contributionType: string;
  bouquetContributions?: BouquetContribution[];
  plantProject: PlantProject;
}

enum Purpose {
  TREES = 'trees',
  CONSERVATION = 'conservation',
}

export interface ContributionsGeoJsonParams {
  profileId: string;
  // purpose: null fetches both trees as well as conservation projects
  purpose: Purpose | null;
}

interface Properties {
  cluster: boolean;
  purpose: string;
  quantity: number;
  plantDate: number | Date;
  contributionType: string;
  plantProject: PlantProject;
}

interface Geometry {
  type: string;
  coordinates: number[];
}

export interface ContributionsGeoJson {
  // procedure returns ContributionsGeoJson
  type: string;
  properties: Properties;
  geometry: Geometry;
}

interface PlantProject {
  guid: string;
  name: string | null;
  image: string;
  country: string;
  unit: string;
  location: string;
  geoLatitude: number;
  geoLongitude: number;
  tpo: Tpo;
}

interface Tpo {
  id: number;
  guid: string;
  name: string | null;
}
export interface ProjectProps {
  key: number;
  projectInfo: Contributions;
}

export interface ContributedProjectListProps {
  isConservedButtonActive?: boolean;
  contributionProjectList: Contributions[];
}

export interface DonationInfoProps {
  projects: number | null;
  countries: number | null;
  donations: number | null;
}

export interface PlantedTreesButtonProps {
  plantedTrees: number | null;
  isTreePlantedButtonActive: boolean;
  setIsConservedButtonActive: SetState<boolean>;
  setIsTreePlantedButtonActive: SetState<boolean>;
}
export interface ConservationButtonProps {
  conservedArea: number | null;
  setIsTreePlantedButtonActive: SetState<boolean>;
  setIsConservedButtonActive: SetState<boolean>;
  isConservedButtonActive: boolean;
}
export interface TreeContributedProjectListProps {
  contribution: Contributions[];
  userprofile: User;
  authenticatedType: string;
  handleFetchNextPage: () => void;
}

export interface AreaConservedProjectListProps {
  contribution: Contributions[];
  isConservedButtonActive: boolean;
  handleFetchNextPage: () => void;
}

export interface StatsQueryResult {
  treeCount: number;
  squareMeters: number;
  conserved: number;
  projects: number;
  countries: number;
  donations: number;
}

export interface ContributionsGeoJsonQueryResult {
  purpose: string;
  tree_count: number;
  quantity: number;
  contribution_type: string;
  plant_date: string;
  location: string;
  country: string;
  unit_type: string;
  guid: string;
  name: string;
  image: string;
  geo_latitude: number;
  geo_longitude: number;
  tpoGuid: string;
  tpo: string;
}
