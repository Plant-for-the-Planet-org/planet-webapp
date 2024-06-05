import ConservedAreaTargetIcon from '../../../../../../public/assets/images/icons/Mfv2/ConservAreaTargetIcon';
import CustomTargetSwitch from './CustomTargetSwitch';
import CustomTargetTextField from './CustomTargetTextField';
import targetBarStyle from '../TreeTargetBar.module.scss';
import { ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';
import { useMyForestV2 } from '../../../../common/Layout/MyForestContextV2';
import themeProperties from '../../../../../theme/themeProperties';

const ConservAreaTargetModal = () => {
  const { conservTarget, setConservTarget, setConservChecked, conservChecked } =
    useMyForestV2();
  const { mediumBlue } = themeProperties;
  const tProfile = useTranslations('Profile');

  const handleSwitchChange = (e: ChangeEvent<HTMLInputElement>) => {
    //if user set some target then make toggle active and set the localstorage
    if (conservTarget > 0) {
      setConservChecked(e.target.checked);
      localStorage.setItem('conservChecked', `${e.target.checked}`);
    }
  };

  const handleTextFieldChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    localStorage.setItem('conservChecked', `true`);
    setConservChecked(Number(e.target.value) > 0 ? true : false);
    setConservTarget(Number(e.target.value));
  };
  return (
    <div
      className={
        conservChecked
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
          switchColor={`${mediumBlue}`}
          onChange={handleSwitchChange}
          checked={conservChecked}
        />
      </div>
      <CustomTargetTextField
        type="number"
        variant="outlined"
        focusColor={`${mediumBlue}`}
        onChange={handleTextFieldChange}
        value={conservTarget || ''}
      />
    </div>
  );
};

export default ConservAreaTargetModal;
