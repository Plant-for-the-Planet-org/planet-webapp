import { AreaRestoredIcon } from '../../../../../../public/assets/images/icons/ProgressBarIcons';
import CustomTargetSwitch from './CustomTargetSwitch';
import CustomTargetTextField from './CustomTargetTextField';
import targetBarStyle from '../TreeTargetBar.module.scss';
import { useMyForestV2 } from '../../../../common/Layout/MyForestContextV2';
import { useTranslations } from 'next-intl';
import { ChangeEvent } from 'react';
import themeProperties from '../../../../../theme/themeProperties';

const RestoreAreaTargetModal = () => {
  const { restoreTarget, setRestoreTarget, restoreChecked, setRestoreChecked } =
    useMyForestV2();
  const tProfile = useTranslations('Profile');
  const { electricPurple } = themeProperties;

  const handleSwitchChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (restoreTarget > 0) {
      setRestoreChecked(e.target.checked);
    }
  };

  const handleTextFieldChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRestoreChecked(Number(e.target.value) > 0 ? true : false);
    setRestoreTarget(Number(e.target.value));
  };

  return (
    <div
      className={
        restoreChecked
          ? targetBarStyle.restoreTreeTargetModalMainContainer
          : targetBarStyle.deActivateTargetModal
      }
    >
      <div className={targetBarStyle.switchMainContainer}>
        <div className={targetBarStyle.switchSubContainer}>
          <div className={targetBarStyle.restoreTreeModalIconContainer}>
            <AreaRestoredIcon width={14} />
          </div>
          <div className={targetBarStyle.label}>
            {tProfile('progressBar.areaRestoredTarget')}
          </div>
        </div>
        <CustomTargetSwitch
          switchColor={`${electricPurple}`}
          checked={restoreChecked}
          onChange={handleSwitchChange}
        />
      </div>
      <CustomTargetTextField
        variant="outlined"
        focusColor={`${electricPurple}`}
        onChange={handleTextFieldChange}
        value={restoreTarget || ''}
      />
    </div>
  );
};

export default RestoreAreaTargetModal;
