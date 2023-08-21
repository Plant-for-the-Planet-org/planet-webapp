import { SetState } from './common';
import { User } from '@planet-sdk/common';
import { Geometry } from '@turf/turf';

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

interface Properties {
  cluster: boolean;
  purpose: string;
  quantity: number;
  plantDate: number | Date;
  contributionType: string;
  plantProject: PlantProject;
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
  handleFetchNextPage: () => void;
  contributionProjectList: Contributions[];
  isLoadButtonActive: boolean;
  setIsLoadButtonActive: SetState<boolean>;
}

export interface DonationInfoProps {
  projects: number | null;
  countries: number | null;
  donations: number | null;
}

export interface PlantedTreesButtonProps {
  plantedTrees: number | null;
}
export interface ConservationButtonProps {
  conservedArea: number | null;
}
export interface TreeContributedProjectListProps {
  contribution: Contributions[];
  userprofile: User;
  authenticatedType: string;
  handleFetchNextPage: () => void;
}

export interface AreaConservedProjectListProps {
  contribution: Contributions[];
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
  treeCount: number;
  quantity: number;
  contribution_type: string;
  location: string;
  country: string;
  unit_type: string;
  guid: string;
  name: string;
  image: string;
  geoLatitude: number;
  geoLongitude: number;
  geometry: Geometry | null;
  tpoGuid: string;
  tpo: string;
  startDate: string;
  endDate: string;
  totalContribution: number;
}
