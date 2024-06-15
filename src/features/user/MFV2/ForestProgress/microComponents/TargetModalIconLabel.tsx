import { useMemo } from 'react';
import targetModalStyle from '../ForestProgress.module.scss';
import { useTranslations } from 'next-intl';
import {
  TreesPlantedIcon,
  AreaRestoredIcon,
  ConservedAreaIcon,
} from '../../../../../../public/assets/images/icons/ProgressBarIcons';
import { DataType } from '../ForestProgressItem';

type TargetModalIconLabel = {
  dataType: DataType;
  target: number;
};

const TargetModalIconLabel = ({ dataType, target }: TargetModalIconLabel) => {
  const tProfile = useTranslations('Profile.progressBar');
  const getIcon = useMemo(() => {
    switch (dataType) {
      case 'treesPlanted':
        return <TreesPlantedIcon width={16} />;
      case 'areaRestored':
        return <AreaRestoredIcon width={14} />;
      case 'areaConserved':
        return <ConservedAreaIcon width={12} />;
    }
  }, [dataType]);

  const getLabel = useMemo(() => {
    switch (dataType) {
      case 'treesPlanted':
        return tProfile('plantedTreesTarget');
      case 'areaRestored':
        return tProfile('areaRestoredTarget');
      case 'areaConserved':
        return tProfile('areaConservedTarget');
    }
  }, [dataType, target]);
  return (
    <div className={targetModalStyle.targetInputIconMainContainer}>
      <div
        className={`${targetModalStyle.targetInputIconContainer} targetInputIconContainer`}
      >
        {getIcon}
      </div>
      <div className={targetModalStyle.label}>{getLabel}</div>
    </div>
  );
};

export default TargetModalIconLabel;
