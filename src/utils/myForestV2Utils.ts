import themeProperties from '../theme/themeProperties';
import { ProgressDataType } from '../features/user/MFV2/ForestProgress/ForestProgressItem';
import { ContributionStats } from '../features/common/types/myForestv2';

// helper function to calculate gift and recieved percentage for progress bar

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

//helper function to get colors for target modal and progress bar based on data Type

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

//helper function to aggregate all personal and gift contributions for progress bar

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

// Determines whether the progress bar should be enabled based on current and target values for trees donated, area restored, and area conserved.

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
