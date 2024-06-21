import { ProjectPurposeTypes, UnitTypes } from '@planet-sdk/common';
import { ExtractedProjectData } from '../features/user/MFV2/ContributionsMap/Markers/ClusterMarker';
import themeProperties from '../theme/themeProperties';
import { PointFeature } from 'supercluster';
import { DonationProperties } from '../features/common/types/myForestv2';

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
 * @returns tertiaryProjectColor, mainProjectColor, secondaryProjectColor
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
 * @returns uniqueProjects, maxContributingProject
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
