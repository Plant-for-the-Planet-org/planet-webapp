import type { ProjectPurposeTypes, UnitTypes } from '@planet-sdk/common';
import type { ExtractedProjectData } from '../features/user/Profile/ContributionsMap/Markers/DonationClusterMarker';
import type { PointFeature } from 'supercluster';
import type { DonationProperties } from '../features/common/types/myForest';
import type { ProgressDataType } from '../features/user/Profile/ForestProgress/ForestProgressItem';
import type { ContributionStats } from '../features/common/types/myForest';

import themeProperties from '../theme/themeProperties';
export type Accumulator = {
  maxContributionCount: number;
  maxContributingObject: ExtractedProjectData | null;
};

/**
 * The getColor function determines the color associated with a specific project purpose and unit type.
 * @param purpose
 * @param unitType
 * @returns  color
 */

export const getColor = (purpose: ProjectPurposeTypes, unitType: UnitTypes) => {
  const { primaryColor, deepPurple, warmBlue } =
    themeProperties.designSystem.colors;
  if (unitType === 'm2' && purpose === 'trees') {
    return deepPurple;
  } else if (purpose === 'conservation') {
    return warmBlue;
  } else {
    return primaryColor;
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
 * helper function to calculate gift and recieved percentage for progress bar
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
  const { primaryDarkColor, electricPurpleColor, mediumBlueColor } =
    themeProperties;
  switch (dataType) {
    case 'treesPlanted':
      return primaryDarkColor;
    case 'areaRestored':
      return electricPurpleColor;
    case 'areaConserved':
      return mediumBlueColor;
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
 * @param restoreTarget
 * @param conservTarget
 * @returns boolean indicating whether the progress bars should be shown
 */
export const checkProgressEnabled = (
  treesDonated: number,
  areaRestored: number,
  areaConserved: number,
  treeTarget: number,
  restoreTarget: number,
  conservTarget: number
) => {
  return !(
    treesDonated === 0 &&
    treeTarget === 0 &&
    areaRestored === 0 &&
    restoreTarget === 0 &&
    conservTarget === 0 &&
    areaConserved === 0
  );
};
