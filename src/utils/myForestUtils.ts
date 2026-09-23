import type {
  ProjectPurposeTypes,
  UnitTypes,
  User,
  UserPublicProfile,
} from '@planet-sdk/common';
import type { ExtractedProjectData } from '../features/user/Profile/ContributionsMap/Markers/DonationClusterMarker';
import type { PointFeature } from 'supercluster';
import type {
  ContributionsResponse,
  DonationProperties,
  Leaderboard,
  MapLocation,
  MyContributionsSingleProject,
  MyContributionsSingleRegistration,
  MyForestProject,
  ProjectListResponse,
} from '../features/common/types/myForest';
import type { ProgressDataType } from '../features/user/Profile/ForestProgress/ForestProgressItem';
import type { ContributionStats } from '../features/common/types/myForest';

import themeProperties from '../theme/themeProperties';
import getPointCoordinates from './getPointCoordinates';
export type Accumulator = {
  maxContributionCount: number;
  maxContributingObject: ExtractedProjectData | null;
};

interface MyForestApiResponse {
  stats: ContributionsResponse['stats'];
  myContributionsMap: ContributionsResponse['myContributionsMap'];
  registrationLocationsMap: ContributionsResponse['registrationLocationsMap'];
  projectLocationsMap: ContributionsResponse['projectLocationsMap'];
  leaderboard: Leaderboard;
  projects: ProjectListResponse;
}

interface UseMyForestApiResult {
  data: {
    projectListResult?: ProjectListResponse;
    contributionsResult?: ContributionsResponse;
    leaderboardResult?: Leaderboard;
  };
  loading: {
    isProjectsListLoaded: boolean;
    isContributionsLoaded: boolean;
    isLeaderboardLoaded: boolean;
  };
  error: string | null;
  refetch: () => Promise<void>;
}
/**
 * The getColor function determines the color associated with a specific project purpose and unit type.
 * @param purpose
 * @param unitType
 * @returns  color
 */

export const getColor = (purpose: ProjectPurposeTypes, unitType: UnitTypes) => {
  const { forestGreen, deepPurple, warmBlue } =
    themeProperties.designSystem.colors;
  if (unitType === 'm2' && purpose === 'trees') {
    return deepPurple;
  } else if (purpose === 'conservation') {
    return warmBlue;
  } else {
    return forestGreen;
  }
};

/**
 * The getClusterMarkerColors function determines the colors to be used for cluster markers based on the projects with the highest contribution and unique projects within the cluster
 * @param maxContributingProject
 * @param uniqueUnitTypePurposeProjects
 * @returns object containing tertiaryProjectColor, mainProjectColor, secondaryProjectColor
 */

export const getDonationClusterMarkerColors = (
  maxContributingProject: ExtractedProjectData | null,
  uniqueUnitTypePurposeProjects: ExtractedProjectData[]
) => {
  if (maxContributingProject) {
    const { purpose, unitType } = maxContributingProject;
    const mainProjectColor = getColor(purpose, unitType) ?? '';
    let tertiaryProjectColor = '',
      secondaryProjectColor = '';
    const length = uniqueUnitTypePurposeProjects?.length || 0;
    if (length === 0) {
      tertiaryProjectColor = secondaryProjectColor = mainProjectColor;
    } else if (length === 1) {
      tertiaryProjectColor = getColor(
        uniqueUnitTypePurposeProjects[0]?.purpose,
        uniqueUnitTypePurposeProjects[0]?.unitType
      );
      secondaryProjectColor = mainProjectColor;
    } else {
      tertiaryProjectColor = getColor(
        uniqueUnitTypePurposeProjects[0]?.purpose,
        uniqueUnitTypePurposeProjects[0]?.unitType
      );
      secondaryProjectColor = getColor(
        uniqueUnitTypePurposeProjects[1]?.purpose,
        uniqueUnitTypePurposeProjects[1]?.unitType
      );
    }

    return { tertiaryProjectColor, secondaryProjectColor, mainProjectColor };
  }
  return {
    tertiaryProjectColor: '',
    secondaryProjectColor: '',
    mainProjectColor: '',
  };
};

//*The extractAndClassifyProjectData function processes an array of cluster child objects to extract and classify project data.
//* It returns a list of unique projects and identifies the project with the maximum contribution count.

/**
 *
 * @param clusterChildren
 * @returns object containing uniqueProjects, maxContributingProject
 */

export const extractAndClassifyProjectData = (
  clusterChildren: PointFeature<DonationProperties>[] | undefined
): {
  maxContributingProject: ExtractedProjectData | null;
  uniqueProjects: ExtractedProjectData[];
} => {
  let maxContributingProject: ExtractedProjectData | null = null;
  let maxContributionCount = -Infinity;
  const remainingProjects: ExtractedProjectData[] = [];

  if (!clusterChildren || clusterChildren.length === 0) {
    return { uniqueProjects: [], maxContributingProject: null };
  }

  // Extract required fields from each object
  clusterChildren.forEach((item) => {
    const extractedProjectData: ExtractedProjectData = {
      unitType: item.properties.projectInfo.unitType,
      classification: item.properties.projectInfo.classification,
      purpose: item.properties.projectInfo.purpose,
      contributionCount: item.properties.contributionInfo.contributionCount,
    };

    if (extractedProjectData.contributionCount > maxContributionCount) {
      maxContributionCount = extractedProjectData.contributionCount;
      maxContributingProject = extractedProjectData;
    }

    // Loop through the array to find the object with the unique purpose and unit type
    if (
      extractedProjectData.unitType !==
        (maxContributingProject !== null && maxContributingProject.unitType) ||
      extractedProjectData.purpose !==
        (maxContributingProject !== null && maxContributingProject.purpose)
    ) {
      remainingProjects.push(extractedProjectData);
    }
  });

  const uniqueCombinations = new Map<string, ExtractedProjectData>();
  // Loop through the array to find  the object with the unique purpose and unit type
  remainingProjects.forEach((obj) => {
    const { unitType, purpose } = obj;
    const key = unitType + '-' + purpose;

    if (!uniqueCombinations.has(key)) {
      uniqueCombinations.set(key, obj);
    }
  });

  const uniqueProjects = Array.from(uniqueCombinations.values());
  return { uniqueProjects, maxContributingProject };
};

/**
 * helper function to calculate gift and received percentage for progress bar
 * @param target - specific target for the item
 * @param gift - contributions from gifts received
 * @param personal - contributions from donations made (including gifts given)
 * @returns object containing giftPercentage and personalPercentage
 */
export const calculateGraphSegmentLengths = (
  target: number,
  gift: number,
  personal: number
): { giftSegmentPercentage: number; personalSegmentPercentage: number } => {
  if (target > gift + personal) {
    const giftSegmentPercentage = (gift / target) * 100;
    const personalSegmentPercentage = (personal / target) * 100;
    return { giftSegmentPercentage, personalSegmentPercentage };
  } else {
    const total = gift + personal;
    if (total === 0) {
      return { giftSegmentPercentage: 0, personalSegmentPercentage: 0 };
    } else {
      const giftSegmentPercentage = (gift / total) * 100;
      const personalSegmentPercentage = (personal / total) * 100;
      return { giftSegmentPercentage, personalSegmentPercentage };
    }
  }
};

/**
 * helper function to get colors for target modal and progress bar based on data type
 * @param dataType - type of data shown in the graph (treesPlanted, areaRestored, areaConserved)
 * @returns color based on the data type
 */
export const targetColor = (dataType: ProgressDataType) => {
  const { primaryColor, deepPurple, warmBlue } =
    themeProperties.designSystem.colors;
  switch (dataType) {
    case 'treesPlanted':
      return primaryColor;
    case 'areaRestored':
      return deepPurple;
    case 'areaConserved':
      return warmBlue;
  }
};

/**
 * helper function to process / aggregate all personal and gift contributions for progress bars
 * @param contributionStats - object containing all the contribution stats as returned by the API
 * @returns object containing total trees donated, total area restored, and total area conserved
 */
export const aggregateProgressData = (
  contributionStats: ContributionStats | undefined
) => {
  const treesDonated =
    (contributionStats?.treesDonated.personal ?? 0) +
    (contributionStats?.treesDonated.received ?? 0) +
    (contributionStats?.treesRegistered ?? 0);
  const areaRestored =
    (contributionStats?.areaRestoredInM2.personal ?? 0) +
    (contributionStats?.areaRestoredInM2.received ?? 0);
  const areaConserved =
    (contributionStats?.areaConservedInM2.personal ?? 0) +
    (contributionStats?.areaConservedInM2.received ?? 0);
  return { treesDonated, areaRestored, areaConserved };
};

/**
 * Determines whether the progress bar should be enabled based on current and target values for trees donated, area restored, and area conserved.
 * @param treesDonated
 * @param areaRestored
 * @param areaConserved
 * @param treeTarget
 * @param restorationTarget
 * @param conservationTarget
 * @returns boolean indicating whether the progress bars should be shown
 */
export const checkProgressEnabled = (
  treesDonated: number,
  areaRestored: number,
  areaConserved: number,
  treeTarget: number,
  restorationTarget: number,
  conservationTarget: number
) => {
  return !(
    treesDonated === 0 &&
    treeTarget === 0 &&
    areaRestored === 0 &&
    restorationTarget === 0 &&
    conservationTarget === 0 &&
    areaConserved === 0
  );
};

/**
 * Convert array format to Map format
 * Handles both array of tuples and Map instances
 */
const convertToMap = <K, V>(
  data: Array<[K, V]> | Map<K, V> | undefined
): Map<K, V> => {
  if (!data) return new Map();
  if (data instanceof Map) return data;

  const map = new Map<K, V>();
  if (Array.isArray(data)) {
    data.forEach(([key, value]) => {
      if (key && value) {
        map.set(key, value);
      }
    });
  }
  return map;
};
/**
 * Safely transforms API response into UI-friendly structure.
 * Ensures consistent defaults and converts Maps/Arrays properly.
 */

export const transformResponse = (
  response: MyForestApiResponse
): UseMyForestApiResult['data'] => {
  // Ensure response exists and has required properties
  if (!response) {
    return {
      projectListResult: {},
      contributionsResult: {
        stats: {
          giftsReceivedCount: 0,
          contributionsMadeCount: 0,
          treesRegistered: 0,
          treesDonated: { personal: 0, received: 0 },
          areaRestoredInM2: { personal: 0, received: 0 },
          areaConservedInM2: { personal: 0, received: 0 },
        },
        myContributionsMap: new Map(),
        registrationLocationsMap: new Map(),
        projectLocationsMap: new Map(),
      },
      leaderboardResult: { mostRecent: [], mostTrees: [] },
    };
  }

  // Convert projects array to Map if needed (depending on API response format)
  let projects = response.projects || {};
  if (Array.isArray(response.projects)) {
    const projectsMap: ProjectListResponse = {};
    response.projects.forEach((project: MyForestProject) => {
      if (project && project.guid) {
        projectsMap[project.guid] = project;
      }
    });
    projects = projectsMap;
  }

  // Transform the combined response into the expected format
  const stats = {
    giftsReceivedCount: response.stats?.giftsReceivedCount || 0,
    contributionsMadeCount: response.stats?.contributionsMadeCount || 0,
    treesRegistered: response.stats?.treesRegistered || 0,
    treesDonated: response.stats?.treesDonated || {
      personal: 0,
      received: 0,
    },
    areaRestoredInM2: response.stats?.areaRestoredInM2 || {
      personal: 0,
      received: 0,
    },
    areaConservedInM2: response.stats?.areaConservedInM2 || {
      personal: 0,
      received: 0,
    },
  };

  const contributionsResult: ContributionsResponse = {
    stats,
    myContributionsMap: convertToMap(response.myContributionsMap),
    registrationLocationsMap: convertToMap(response.registrationLocationsMap),
    projectLocationsMap: convertToMap(response.projectLocationsMap),
  };

  return {
    projectListResult: projects,
    contributionsResult,
    leaderboardResult: response.leaderboard || {
      mostRecent: [],
      mostTrees: [],
    },
  };
};

/**
 * Creates a GeoJSON point feature for donation entries
 * Links project geometry with contribution info
 */
const generateDonationGeojson = (
  project: MyForestProject,
  contributionsForProject: MyContributionsSingleProject
) => {
  return {
    type: 'Feature',
    geometry: project.geometry,
    properties: {
      projectInfo: project,
      contributionInfo: contributionsForProject,
    },
  } as PointFeature<DonationProperties>;
};

/**
 * Creates a GeoJSON Point feature for registration entries
 * Normalizes registration location geometry (Point or Polygon)
 * into a single Point using the geometry’s center of mass,
 * making it suitable for clustering and point-based map layers.
 */
const generateRegistrationGeojson = (
  registrationLocation: MapLocation,
  registration: MyContributionsSingleRegistration
) => {
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: getPointCoordinates(registrationLocation.geometry),
    },
    properties: registration,
  } as PointFeature<MyContributionsSingleRegistration>;
};

/**
 * Generates GeoJSON dataset for the map based on contributions
 * Splits into donation vs registration features for different layers
 */
export const generateContributionsGeojson = (
  contributionsResult: ContributionsResponse,
  projectListResult: ProjectListResponse
) => {
  const registrationGeojson: PointFeature<MyContributionsSingleRegistration>[] =
    [];
  const donationGeojson: PointFeature<DonationProperties>[] = [];

  const { myContributionsMap, registrationLocationsMap } = contributionsResult;

  if (myContributionsMap instanceof Map) {
    myContributionsMap.forEach((item, key) => {
      if (item.type === 'project') {
        if (projectListResult[key]) {
          const geo = generateDonationGeojson(projectListResult[key], item);
          donationGeojson.push(geo);
        }
      } else {
        const regLocation = registrationLocationsMap.get(key);
        if (regLocation) {
          const geo = generateRegistrationGeojson(regLocation, item);
          registrationGeojson.push(geo);
        }
      }
    });
  }

  return { registrationGeojson, donationGeojson };
};

type ForestUserInfo = {
  profileId: string;
  slug: string;
  targets: {
    treesDonated: number;
    areaRestored: number;
    areaConserved: number;
  };
};

export const transformProfileToForestUserInfo = (
  profile: User | UserPublicProfile
): ForestUserInfo => ({
  profileId: profile.id,
  slug: profile.slug,
  targets: {
    treesDonated: profile.scores.treesDonated.target ?? 0,
    areaRestored: profile.scores.areaRestored.target ?? 0,
    areaConserved: profile.scores.areaConserved.target ?? 0,
  },
});
