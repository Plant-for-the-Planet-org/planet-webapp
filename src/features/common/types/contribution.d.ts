import { SetState } from "./common";
import { User } from "@planet-sdk/common";


export interface StatsParam {
	profileId: string;
}

export interface Stats {
	conserved: number;
	countries: number;
	donations: number;
	projects: number;
	squareMeters: number;
	treeCount: number
}

  interface Tpo {
    id: number
    guid: string
    name: string
  }
  interface PlantProject {
    guid: string
    name: string | null
    image: string
    country: string
    unit: string
    location: any
    geoLatitude: any
    geoLongitude: any
    tpo: any
  }
 
  interface BouquetContribution {
    purpose: string | null
    treeCount: Decimal | null
    quantity: number | null
    plantDate: number | Date
    contributionType: string
    plantProject: PlantProject | null
  }
  
 
 export  interface Contributions { // procedure returns Contributions
    purpose: string | null
    treeCount: Decimal | null
    quantity: number | null
    plantDate: number | Date
    contributionType: string
    bouquetContributions?: BouquetContribution[]
    plantProject: PlantProject
  }
  
  enum Purpose {
    TREES = 'trees',
    CONSERVATION = 'conservation',
  }

  export interface ContributionsGeoJson {
    profileId: string,
		// purpose: null fetches both trees as well as conservation projects
    purpose: Purpose | null
}


interface Properties {
    cluster: boolean
    category: string
    quantity: number
    plantDate: number | Date
    contributionType: string
    plantProject: PlantProject
  }

  interface Geometry {
    type: string
    coordinates: number[]
  }

interface ContributionsGeoJson { // procedure returns ContributionsGeoJson
    type: string
    properties: Properties
    geometry: Geometry
  }
  
  
interface PlantProject {
    guid: string
    name: string | null
    image: string
    country: string
    unit: string
    location: string
    geoLatitude: number
    geoLongitude: number
    tpo: Tpo
  }
  
  interface Tpo {
    id: number
    guid: string
    name: string | null
  }

  export interface AreaConservedProjectListProps {
    contribution: Contributions[];
    isConservedButtonActive: boolean;
  }

  export  interface ConservationButtonProps {
    conservedArea: number | null;
    setIsTreePlantedButtonActive: SetState<boolean>;
    setIsConservedButtonActive: SetState<boolean>;
    isConservedButtonActive: boolean;
  }

  export  interface ProjectProps {
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

  export interface TreeContributedProjectListProps {
    contribution: Contributions[];
    userprofile: User;
    authenticatedType: string;
  }

 
  
