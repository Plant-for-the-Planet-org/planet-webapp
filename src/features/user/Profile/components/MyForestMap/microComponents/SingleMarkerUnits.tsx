import MyForestMapStyle from '../../../styles/MyForestMap.module.scss';
import { useTranslations } from 'next-intl';

export interface SingleMarkerUnitsProps {
  isNormalTreeDonation: boolean;
  isRegisteredTree: boolean;
  isRestorationTreePlantation: boolean;
  isConservation: boolean;
  isGiftContribution: boolean;
  isMergeContribution: boolean;
  units: number;
}

const SingleMarkerUnits = ({
  isConservation,
  isRestorationTreePlantation,
  units,
  isRegisteredTree,
  isNormalTreeDonation,
  isGiftContribution,
  isMergeContribution,
}: SingleMarkerUnitsProps) => {
  const t = useTranslations('Profile');
  return (
    <div className={MyForestMapStyle.trees}>
      {(isConservation || isRestorationTreePlantation) &&
        t('myForestMap.area', {
          areaConserved: units,
        })}
      {(isNormalTreeDonation ||
        isRegisteredTree ||
        isGiftContribution ||
        isMergeContribution) &&
        t('myForestMap.plantedTree', {
          count: units,
        })}
    </div>
  );
};

export default SingleMarkerUnits;
