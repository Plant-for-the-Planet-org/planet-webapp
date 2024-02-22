import MyForestMapStyle from '../../../styles/MyForestMap.module.scss';
import { useTranslation } from 'next-i18next';

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
  const { t, ready } = useTranslation(['profile']);
  return ready ? (
    <div className={MyForestMapStyle.trees}>
      {t(
        isConservation || isRestorationTreePlantation
          ? 'profile:myForestMap.area'
          : '',
        {
          areaConserved: units,
        }
      )}
      {t(
        isNormalTreeDonation ||
          isRegisteredTree ||
          isGiftContribution ||
          isMergeContribution
          ? 'profile:myForestMap.plantedTree'
          : '',
        {
          count: units,
        }
      )}
    </div>
  ) : (
    <></>
  );
};

export default SingleMarkerUnits;
