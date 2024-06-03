import RestoredTreeTargetIcon from '../../../../../../public/assets/images/icons/Mfv2/RestoredTreeTargetIcon';
import CustomTargetSwitch from './CustomTargetSwitch';
import CustomTargetTextField from './CustomTargetTextField';
import targetBarStyle from '../TreeTargetBar.module.scss';
import { useMyForestV2 } from '../../../../common/Layout/MyForestContextV2';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

const RestoreAreaTargetModal = () => {
  const { restoreTarget, setRestoreTarget } = useMyForestV2();
  const tProfile = useTranslations('Profile');
  const [checked, setChecked] = useState(restoreTarget > 0);

  const handleChange = () => {
    if (restoreTarget > 0) {
      setChecked(true);
    } else {
      setChecked(false);
    }
  };

  return (
    <div
      className={
        restoreTarget > 0
          ? targetBarStyle.restoreTreeTargetModalMainContainer
          : targetBarStyle.deActivateTargetModal
      }
    >
      <div className={targetBarStyle.switchMainContainer}>
        <div className={targetBarStyle.switchSubContainer}>
          <div className={targetBarStyle.restoreTreeModalIconContainer}>
            <RestoredTreeTargetIcon width={14} />
          </div>
          <div className={targetBarStyle.label}>
            {tProfile('progressBar.areaRestoredTarget')}
          </div>
        </div>
        <CustomTargetSwitch
          switchColor="#9B51E0"
          checked={checked}
          onChange={handleChange}
        />
      </div>
      <CustomTargetTextField
        variant="outlined"
        focusColor="#9B51E0"
        onChange={(e) => {
          setChecked(e.target.value ? true : false);
          setRestoreTarget(Number(e.target.value));
        }}
        value={restoreTarget || ''}
      />
    </div>
  );
};

export default RestoreAreaTargetModal;
