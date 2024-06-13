import targetModalStyle from '../TreeTargetBar.module.scss';
import { useTranslations } from 'next-intl';
import themeProperties from '../../../../../theme/themeProperties';
import { ChangeEvent, useState, useMemo } from 'react';
import {
  AreaRestoredIcon,
  ConservedAreaIcon,
  TreesPlantedIcon,
} from '../../../../../../public/assets/images/icons/ProgressBarIcons';
import TargetSwitch from './TargetSwitch';
import TargetTextField from './TargetTextField';
import { SetState } from '../../../../common/types/common';

type TargetFormInputProps = {
  dataType: string;
  checked: boolean;
  setChecked: SetState<boolean>;
  target: number;
};

const TargetFormInput = ({
  dataType,
  checked,
  setChecked,
  target,
}: TargetFormInputProps) => {
  const tProfile = useTranslations('Profile');
  const [userTarget, setUserTarget] = useState(target);

  const {
    primaryDarkColor,
    greenHaze,
    amethystPurple,
    ceruleanBlue,
    electricPurple,
    mediumBlue,
    mediumGray,
    lightGray,
  } = themeProperties;

  const handleSwitchChange = (e: ChangeEvent<HTMLInputElement>) => {
    //if user set some target then make toggle active and set the localstorage
    if (target > 0) {
      setChecked(e.target.checked);
    }
  };

  const handleTextFieldChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setChecked(Number(e.target.value) > 0 ? true : false);
    setUserTarget(Number(e.target.value));
  };

  const getLighterColor = useMemo(() => {
    switch (dataType) {
      case 'treesPlanted':
        return checked
          ? { background: `${greenHaze}` }
          : { background: `${lightGray}` };
      case 'areaRestored':
        return checked
          ? { background: `${amethystPurple}` }
          : { background: `${lightGray}` };
      case 'areaConserved':
        return checked
          ? { background: `${ceruleanBlue}` }
          : { background: `${lightGray}` };
      default:
        return {};
    }
  }, [dataType, checked]);

  const getDarkerColor = useMemo(() => {
    switch (dataType) {
      case 'treesPlanted':
        return checked
          ? { background: `${primaryDarkColor}` }
          : { background: `${mediumGray}` };
      case 'areaRestored':
        return checked
          ? { background: `${electricPurple}` }
          : { background: `${mediumGray}` };
      case 'areaConserved':
        return checked
          ? { background: `${mediumBlue}` }
          : { background: `${mediumGray}` };
      default:
        return {};
    }
  }, [dataType, checked]);

  const getColor = useMemo(() => {
    switch (dataType) {
      case 'treesPlanted':
        return primaryDarkColor;
      case 'areaRestored':
        return electricPurple;
      case 'areaConserved':
        return mediumBlue;
      default:
        return '';
    }
  }, [dataType]);

  const getIcon = useMemo(() => {
    switch (dataType) {
      case 'treesPlanted':
        return <TreesPlantedIcon width={16} />;
      case 'areaRestored':
        return <AreaRestoredIcon width={14} />;
      case 'areaConserved':
        return <ConservedAreaIcon width={12} />;
      default:
        return null;
    }
  }, [dataType]);

  const getLabel = useMemo(() => {
    switch (dataType) {
      case 'treesPlanted':
        return tProfile('progressBar.plantedTreesTarget');
      case 'areaRestored':
        return tProfile('progressBar.areaRestoredTarget');
      case 'areaConserved':
        return tProfile('progressBar.areaConservedTarget');
      default:
        return '';
    }
  }, [dataType, checked, target]);

  const targetStatus = useMemo(
    () =>
      checked
        ? targetModalStyle.targetFormInputContainer
        : targetModalStyle.deActivateTargetModal,
    [dataType, checked]
  );

  console.log(targetStatus, checked);

  const IconAndLabel = () => {
    return (
      <div className={targetModalStyle.targetInputIconMainContainer}>
        <div
          className={targetModalStyle.targetInputIconContainer}
          style={getDarkerColor}
        >
          {getIcon}
        </div>
        <div className={targetModalStyle.label}>{getLabel}</div>
      </div>
    );
  };

  return (
    <div
      className={
        checked
          ? targetModalStyle.targetFormInputContainer
          : targetModalStyle.deActivateTargetModal
      }
      style={getLighterColor}
    >
      <div className={targetModalStyle.switchContainer}>
        <IconAndLabel />
        <TargetSwitch
          switchColor={getColor}
          checked={checked}
          onChange={handleSwitchChange}
        />
      </div>
      <TargetTextField
        type="number"
        variant="outlined"
        focusColor={getColor}
        onChange={handleTextFieldChange}
        value={userTarget || ''}
      />
    </div>
  );
};

export default TargetFormInput;
