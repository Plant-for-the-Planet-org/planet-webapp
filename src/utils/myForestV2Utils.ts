import {
  ExtractedData,
  Accumulator,
} from '../features/user/MFV2/ContributionsMap/Markers/ClusterMarker';
import themeProperties from '../theme/themeProperties';
import { PointFeature, AnyProps } from 'supercluster';

export const getColor = (purpose, unitType) => {
  const { primaryDarkColor, electricPurpleColor, mediumBlueColor } =
    themeProperties;
  if (unitType === 'm2' && purpose === 'trees') {
    return electricPurpleColor;
  } else if (purpose === 'conservation') {
    return mediumBlueColor;
  } else {
    return primaryDarkColor;
  }
};

export const getClusterMarkerColors = (
  maxContributingProject: ExtractedData | null,
  remainingProjects: ExtractedData[]
) => {
  if (maxContributingProject) {
    const { purpose, unitType } = maxContributingProject;
    const mainProjectColor = getColor(purpose, unitType) ?? '';
    let tertiaryProjectColor = '',
      secondaryProjectColor = '';
    const length = remainingProjects.length;
    if (length === 0) {
      tertiaryProjectColor = secondaryProjectColor = mainProjectColor;
    } else if (length === 1) {
      tertiaryProjectColor = getColor(
        remainingProjects[0]?.purpose,
        remainingProjects[0]?.unitType
      );
      secondaryProjectColor = mainProjectColor;
    } else {
      tertiaryProjectColor = getColor(
        remainingProjects[0]?.purpose,
        remainingProjects[0]?.unitType
      );
      secondaryProjectColor = getColor(
        remainingProjects[1]?.purpose,
        remainingProjects[1]?.unitType
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

export const extractAndClassifyProjectData = (
  clusterChildren: PointFeature<AnyProps>[] | undefined
) => {
  const extractedData: ExtractedData[] = [];

  // Extract required fields from each object
  clusterChildren?.forEach((item) => {
    const extractedItem = {
      unitType: item.properties.projectInfo.unitType,
      classification: item.properties.projectInfo.classification,
      purpose: item.properties.projectInfo.purpose,
      contributionCount: item.properties.contributionInfo.contributionCount,
    };
    extractedData.push(extractedItem);
  });

  const { maxContributingObject } = extractedData.reduce(
    (acc: Accumulator, item: ExtractedData | null) => {
      if (item !== null && item.contributionCount > acc.maxContributionCount) {
        return {
          maxContributionCount: item.contributionCount,
          maxContributingObject: item,
        };
      } else {
        return acc;
      }
    },
    { maxContributionCount: -Infinity, maxContributingObject: null }
  );
  // Loop through the array to find the object with the maximum contributionCount
  const remainingProjects: ExtractedData[] = [];

  extractedData.map((item) => {
    if (
      item.unitType !==
        (maxContributingObject !== null && maxContributingObject.unitType) ||
      item.purpose !==
        (maxContributingObject !== null && maxContributingObject.purpose)
    )
      remainingProjects.push(item);
  });
  const uniqueCombinations = new Map();

  remainingProjects.forEach((obj) => {
    const { unitType, purpose } = obj;
    const key = unitType + '-' + purpose;

    if (!uniqueCombinations.has(key)) {
      uniqueCombinations.set(key, obj);
    }
  });

  const uniqueObjects: ExtractedData[] = Array.from(
    uniqueCombinations.values()
  );

  return { uniqueObjects, maxContributingObject };
};
