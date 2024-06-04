import TreeTargetPlantedTrees from '../../../../../../public/assets/images/icons/Mfv2/TreeTargetPlantedTrees';
import CustomTargetTextField from './CustomTargetTextField';
import CustomTargetSwitch from './CustomTargetSwitch';
import targetBarStyle from '../TreeTargetBar.module.scss';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useMyForestV2 } from '../../../../common/Layout/MyForestContextV2';
import themeProperties from '../../../../../theme/themeProperties';

const TreeTargetModal = () => {
  const tProfile = useTranslations('Profile');
  const { treeTarget, setTreeTarget } = useMyForestV2();
  const [checked, setChecked] = useState(treeTarget > 0);
  const { primaryDarkColor } = themeProperties;

  const handleChange = () => {
    if (treeTarget > 0) {
      setChecked(true);
    } else {
      setChecked(false);
    }
  };

  return (
    <div
      className={
        treeTarget
          ? targetBarStyle.treeTargetModalMainContainer
          : targetBarStyle.deActivateTargetModal
      }
    >
      <div className={targetBarStyle.switchMainContainer}>
        <div className={targetBarStyle.switchSubContainer}>
          <div className={targetBarStyle.treeTargetModalIconConatainer}>
            <TreeTargetPlantedTrees width={16} />
          </div>
          <div className={targetBarStyle.label}>
            {tProfile('progressBar.plantedTreesTarget')}
          </div>
        </div>
        <CustomTargetSwitch
          switchColor={`${primaryDarkColor}`}
          checked={checked}
          onChange={handleChange}
        />
      </div>
      <CustomTargetTextField
        type="number"
        variant="outlined"
        focusColor={`${primaryDarkColor}`}
        onChange={(e) => {
          setChecked(e.target.value ? true : false);
          setTreeTarget(Number(e.target.value));
        }}
        value={treeTarget || ''}
      />
    </div>
  );
};

export default TreeTargetModal;
