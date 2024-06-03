import ConservedAreaTargetIcon from '../../../../../../public/assets/images/icons/Mfv2/ConservAreaTargetIcon';
import CustomTargetSwitch from './CustomTargetSwitch';
import CustomTargetTextField from './CustomTargetTextField';
import targetBarStyle from '../TreeTargetBar.module.scss';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useMyForestV2 } from '../../../../common/Layout/MyForestContextV2';

const ConservAreaTargetModal = () => {
  const { conservTarget, setConservTarget } = useMyForestV2();
  const [checked, setChecked] = useState(conservTarget > 0);
  const tProfile = useTranslations('Profile');

  const handleChange = () => {
    if (conservTarget > 0) {
      setChecked(true);
    } else {
      setChecked(false);
    }
  };
  return (
    <div
      className={
        conservTarget > 0
          ? targetBarStyle.conservAreaTargetModalMainContainer
          : targetBarStyle.deActivateTargetModal
      }
    >
      <div className={targetBarStyle.switchMainContainer}>
        <div className={targetBarStyle.switchSubContainer}>
          <div className={targetBarStyle.conservAreaModalIconConatiner}>
            <ConservedAreaTargetIcon width={12} />
          </div>
          <div className={targetBarStyle.label}>
            {tProfile('progressBar.areaConservedTarget')}
          </div>
        </div>
        <CustomTargetSwitch
          switchColor="rgba(45, 156, 219, 1)"
          onChange={handleChange}
          checked={checked}
        />
      </div>
      <CustomTargetTextField
        type="number"
        variant="outlined"
        focusColor="rgba(45, 156, 219, 1)"
        onChange={(e) => {
          setChecked(e.target.value ? true : false);
          setConservTarget(Number(e.target.value));
        }}
        value={conservTarget || ''}
      />
    </div>
  );
};

export default ConservAreaTargetModal;
