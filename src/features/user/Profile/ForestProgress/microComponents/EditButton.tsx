import type { ForestProgressItemProps } from '../ForestProgressItem';

import { useTranslations } from 'next-intl';
import styles from '../ForestProgress.module.scss';
import { EditTargetIcon } from '../../../../../../public/assets/images/icons/ProgressBarIcons';
import { targetColor } from '../../../../../utils/myForestUtils';

type EditButtonProp = Omit<
  ForestProgressItemProps,
  'gift' | 'personal' | 'checked' | 'profilePageType'
>;

const EditButton = ({
  handleEditTargets,
  target,
  dataType,
}: EditButtonProp) => {
  const tProfile = useTranslations('Profile.progressBar');

  return (
    <div className={styles.editTargetButtonContainer}>
      <button
        className={styles.editTargetContainer}
        onClick={handleEditTargets}
      >
        <EditTargetIcon width={9} color={targetColor(dataType)} />
        <p className={styles.editTargetLabel}>
          {target > 0 ? tProfile('editTarget') : tProfile('setTarget')}
        </p>
      </button>
    </div>
  );
};
export default EditButton;
