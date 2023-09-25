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


export interface DonationInfoProps {
  projects: number | null;
  countries: number | null;
  donations: number | null;
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
