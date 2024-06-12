import TreesPlantedIcon from '../../../../../../public/assets/images/icons/Mfv2/TreesPlantedIcon';
import CustomTargetTextField from './CustomTargetTextField';
import CustomTargetSwitch from './CustomTargetSwitch';
import targetBarStyle from '../TreeTargetBar.module.scss';
import { useTranslations } from 'next-intl';
import { useMyForestV2 } from '../../../../common/Layout/MyForestContextV2';
import themeProperties from '../../../../../theme/themeProperties';
import { ChangeEvent } from 'react';

const TreeTargetModal = () => {
  const tProfile = useTranslations('Profile');
  const { treeTarget, setTreeTarget, treeChecked, setTreeChecked } =
    useMyForestV2();
  const { primaryDarkColor } = themeProperties;

  const handleSwitchChange = (e: ChangeEvent<HTMLInputElement>) => {
    //if user set some target then make toggle active and set the localstorage
    if (treeTarget > 0) {
      setTreeChecked(e.target.checked);
    }
  };

  const handleTextFieldChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setTreeChecked(Number(e.target.value) > 0 ? true : false);
    setTreeTarget(Number(e.target.value));
  };

  return (
    <div
      className={
        treeChecked
          ? targetBarStyle.treeTargetModalMainContainer
          : targetBarStyle.deActivateTargetModal
      }
    >
      <div className={targetBarStyle.switchMainContainer}>
        <div className={targetBarStyle.switchSubContainer}>
          <div className={targetBarStyle.treeTargetModalIconConatainer}>
            <TreesPlantedIcon width={16} />
          </div>
          <div className={targetBarStyle.label}>
            {tProfile('progressBar.plantedTreesTarget')}
          </div>
        </div>
        <CustomTargetSwitch
          switchColor={`${primaryDarkColor}`}
          checked={treeChecked}
          onChange={handleSwitchChange}
        />
      </div>
      <CustomTargetTextField
        type="number"
        variant="outlined"
        focusColor={`${primaryDarkColor}`}
        onChange={handleTextFieldChange}
        value={treeTarget || ''}
      />
    </div>
  );
};

export default TreeTargetModal;
