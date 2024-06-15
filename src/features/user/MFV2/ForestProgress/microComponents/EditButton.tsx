import { ForestProgressItemProps } from '../ForestProgressItem';
import { useTranslations } from 'next-intl';
import themeProperties from '../../../../../theme/themeProperties';
import { useMemo } from 'react';
import progressBarStyle from '../ForestProgressBar.module.scss';
import { EditTargetIcon } from '../../../../../../public/assets/images/icons/ProgressBarIcons';

type EditButtonProp = Omit<
  ForestProgressItemProps,
  'gift' | 'personal' | 'checked'
>;

const EditButton = ({ handleOpen, target, dataType }: EditButtonProp) => {
  const tProfile = useTranslations('Profile');
  const { primaryDarkColor, electricPurpleColor, mediumBlueColor } =
    themeProperties;

  const getIconColor = useMemo(() => {
    switch (dataType) {
      case 'treesPlanted':
        return primaryDarkColor;
      case 'areaRestored':
        return electricPurpleColor;
      case 'areaConserved':
        return mediumBlueColor;
    }
  }, [dataType]);

  return (
    <div className={progressBarStyle.editTargetButtonContainer}>
      <button
        className={progressBarStyle.editTargetContainer}
        onClick={handleOpen}
      >
        <EditTargetIcon width={9} color={getIconColor} />
        <p className={`${progressBarStyle.editTargetLabel} editTargetLabel`}>
          {target > 0
            ? tProfile('progressBar.editTarget')
            : tProfile('progressBar.setTarget')}
        </p>
      </button>
    </div>
  );
};
export default EditButton;
