import { ForestProgressItemProps } from '../ForestProgressItem';
import { useTranslations } from 'next-intl';
import progressBarStyle from '../ForestProgress.module.scss';
import { EditTargetIcon } from '../../../../../../public/assets/images/icons/ProgressBarIcons';
import { targetColor } from '../../../../../utils/myForestV2Utils';

type EditButtonProp = Omit<
  ForestProgressItemProps,
  'gift' | 'personal' | 'checked'
>;

const EditButton = ({ handleOpen, target, dataType }: EditButtonProp) => {
  const tProfile = useTranslations('Profile.progressBar');

  return (
    <div className={progressBarStyle.editTargetButtonContainer}>
      <button
        className={progressBarStyle.editTargetContainer}
        onClick={handleOpen}
      >
        <EditTargetIcon width={9} color={targetColor(dataType)} />
        <p className={`${progressBarStyle.editTargetLabel} editTargetLabel`}>
          {target > 0 ? tProfile('editTarget') : tProfile('setTarget')}
        </p>
      </button>
    </div>
  );
};
export default EditButton;
