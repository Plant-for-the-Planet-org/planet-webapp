import { ProjectPurposeTypes, UnitTypes } from '@planet-sdk/common';
import { ExtractedProjectData } from '../features/user/MFV2/ContributionsMap/Markers/ClusterMarker';
import themeProperties from '../theme/themeProperties';
import { PointFeature } from 'supercluster';
import { DonationProperties } from '../features/common/types/myForestv2';
import { ProgressDataType } from '../features/user/MFV2/ForestProgress/ForestProgressItem';
import { ContributionStats } from '../features/common/types/myForestv2';

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
  const { primaryDarkColorX, electricPurpleColor, mediumBlueColor } =
    themeProperties;
  if (unitType === 'm2' && purpose === 'trees') {
    return electricPurpleColor;
  } else if (purpose === 'conservation') {
    return mediumBlueColor;
  } else {
    return primaryDarkColorX;
  }
};

/**
 * The getClusterMarkerColors function determines the colors to be used for cluster markers based on the projects with the highest contribution and unique projects within the cluster
 * @param maxContributingProject
 * @param uniqueUnitTypePurposeProjects
 * @returns object containing tertiaryProjectColor, mainProjectColor, secondaryProjectColor
 */

export const getClusterMarkerColors = (
  maxContributingProject: ExtractedProjectData | null,
  uniqueUnitTypePurposeProjects: ExtractedProjectData[]
) => {
  if (maxContributingProject) {
    const { purpose, unitType } = maxContributingProject;
    const mainProjectColor = getColor(purpose, unitType) ?? '';
    let tertiaryProjectColor = '',
      secondaryProjectColor = '';
    const length = uniqueUnitTypePurposeProjects.length;
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
) => {
  const uniqueProjectType = new Map<string, ExtractedProjectData>();
  let maxContributingProject = null;
  let maxContributionCount = -Infinity;

  if (!clusterChildren || clusterChildren.length === 0) {
    return { uniqueProjects: [], maxContributingProject: null };
  }

  // Extract required fields from each object
  clusterChildren.forEach((item) => {
    const extractedItem: ExtractedProjectData = {
      unitType: item.properties.projectInfo.unitType,
      classification: item.properties.projectInfo.classification,
      purpose: item.properties.projectInfo.purpose,
      contributionCount: item.properties.contributionInfo.contributionCount,
    };

    if (extractedItem.contributionCount > maxContributionCount) {
      maxContributionCount = extractedItem.contributionCount;
      maxContributingProject = extractedItem;
    }

    const key = `${extractedItem.unitType}-${extractedItem.contributionCount}`;
    if (!uniqueProjectType.has(key)) {
      uniqueProjectType.set(key, extractedItem);
    }
  });

  const uniqueProjects = Array.from(uniqueProjectType.values());
  return { uniqueProjects, maxContributingProject };
};

/**
 * helper function to calculate gift and recieved percentage for progress bar
 * @param target - specific target for the item
 * @param gift - contributions from gifts received
 * @param personal - contributions from donations made (including gifts given)
 * @returns object containing giftPercentage and personalPercentage
 */
export const getAchievedTarget = (
  target: number,
  gift: number,
  personal: number
): { giftPercentage: number; personalPercentage: number } => {
  if (target > gift + personal) {
    const giftPercentage = (gift / target) * 100;
    const personalPercentage = (personal / target) * 100;
    return { giftPercentage, personalPercentage };
  } else {
    const total = gift + personal;
    if (total === 0) {
      return { giftPercentage: 0, personalPercentage: 0 };
    } else {
      const giftPercentage = (gift / total) * 100;
      const personalPercentage = (personal / total) * 100;
      return { giftPercentage, personalPercentage };
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
