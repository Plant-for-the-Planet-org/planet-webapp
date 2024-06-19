import themeProperties from '../theme/themeProperties';
import { ProgressDataType } from '../features/user/MFV2/ForestProgress/ForestProgressItem';
import { ProgressData } from '../features/common/types/myForestv2';

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

export const checkProgressEnabled = (
  progressData: ProgressData,
  treeTarget: number,
  restoreTarget: number,
  conservTarget: number
) => {
  return !(
    progressData.treesDonated === 0 &&
    treeTarget === 0 &&
    progressData.areaRestored === 0 &&
    restoreTarget === 0 &&
    conservTarget === 0 &&
    progressData.areaConserved === 0
  );
};
