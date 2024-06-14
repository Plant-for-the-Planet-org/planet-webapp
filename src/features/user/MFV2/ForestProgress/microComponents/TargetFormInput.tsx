import targetModalStyle from '../ForestProgress.module.scss';
import { useTranslations } from 'next-intl';
import themeProperties from '../../../../../theme/themeProperties';
import { ChangeEvent, useState, useMemo, useEffect } from 'react';
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
  latestTarget: number;
  setLatestTarget: SetState<number>;
};

const TargetFormInput = ({
  dataType,
  checked,
  setChecked,
  target,
  latestTarget,
  setLatestTarget,
}: TargetFormInputProps) => {
  const tProfile = useTranslations('Profile');

  const {
    primaryDarkColor,
    greenHazeColor,
    amethystPurpleColor,
    ceruleanBlueColor,
    electricPurpleColor,
    mediumBlueColor,
    mediumGrayColor,
    lightGrayColor,
  } = themeProperties;

  useEffect(() => {
    if (target) setLatestTarget(target);
  }, []);

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
    setLatestTarget(Number(e.target.value));
  };

  const getLighterColor = useMemo(() => {
    switch (dataType) {
      case 'treesPlanted':
        return checked
          ? { background: `${greenHazeColor}` }
          : { background: `${lightGrayColor}` };
      case 'areaRestored':
        return checked
          ? { background: `${amethystPurpleColor}` }
          : { background: `${lightGrayColor}` };
      case 'areaConserved':
        return checked
          ? { background: `${ceruleanBlueColor}` }
          : { background: `${lightGrayColor}` };
      default:
        return {};
    }
  }, [dataType, checked]);

  const getDarkerColor = useMemo(() => {
    switch (dataType) {
      case 'treesPlanted':
        return checked
          ? { background: `${primaryDarkColor}` }
          : { background: `${mediumGrayColor}` };
      case 'areaRestored':
        return checked
          ? { background: `${electricPurpleColor}` }
          : { background: `${mediumGrayColor}` };
      case 'areaConserved':
        return checked
          ? { background: `${mediumBlueColor}` }
          : { background: `${mediumGrayColor}` };
      default:
        return {};
    }
  }, [dataType, checked]);

  const getColor = useMemo(() => {
    switch (dataType) {
      case 'treesPlanted':
        return primaryDarkColor;
      case 'areaRestored':
        return electricPurpleColor;
      case 'areaConserved':
        return mediumBlueColor;
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
    <div className={targetStatus} style={getLighterColor}>
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
        value={latestTarget || ''}
      />
    </div>
  );
};

export default TargetFormInput;
