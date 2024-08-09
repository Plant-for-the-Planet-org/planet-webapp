import styles from '../ForestProgress.module.scss';
import { useTranslations } from 'next-intl';
import {
  TreesPlantedIcon,
  AreaRestoredIcon,
  ConservedAreaIcon,
} from '../../../../../../public/assets/images/icons/ProgressBarIcons';
import { ProgressDataType } from '../ForestProgressItem';

type TargetFormInputLabelProps = {
  dataType: ProgressDataType;
};
const TargetFormInputIcon = ({ dataType }: TargetFormInputLabelProps) => {
  switch (dataType) {
    case 'treesPlanted':
      return <TreesPlantedIcon width={16} />;
    case 'areaRestored':
      return <AreaRestoredIcon width={14} />;
    case 'areaConserved':
      return <ConservedAreaIcon width={12} />;
  }
};

const TargetFormInputLabel = ({ dataType }: TargetFormInputLabelProps) => {
  const tProfile = useTranslations('Profile.progressBar');

  const getLabelText = () => {
    switch (dataType) {
      case 'treesPlanted':
        return tProfile('plantedTreesTarget');
      case 'areaRestored':
        return tProfile('areaRestoredTarget');
      case 'areaConserved':
        return tProfile('areaConservedTarget');
    }
  };
  return (
    <div className={styles.targetInputIconMainContainer}>
      <div className={styles.targetInputIconContainer}>
        <TargetFormInputIcon dataType={dataType} />
      </div>
      <div className={styles.label}>{getLabelText()}</div>
    </div>
  );
};

export default TargetFormInputLabel;
