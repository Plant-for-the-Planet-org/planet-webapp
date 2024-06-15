import targetModalStyle from './ForestProgressBar.module.scss';
import { useTranslations } from 'next-intl';
import themeProperties from '../../../../theme/themeProperties';
import { ChangeEvent, useMemo, useEffect } from 'react';
import {
  AreaRestoredIcon,
  ConservedAreaIcon,
  TreesPlantedIcon,
} from '../../../../../public/assets/images/icons/ProgressBarIcons';
import TargetSwitch from './TargetSwitch';
import TargetTextField from './TargetTextField';
import { SetState } from '../../../common/types/common';

type TargetFormInputProps = {
  dataType: string;
  target: number;
  latestTarget: number;
  setLatestTarget: SetState<number>;
  check: boolean;
  setCheck: SetState<boolean>;
};

const TargetFormInput = ({
  dataType,
  target,
  latestTarget,
  setLatestTarget,
  check,
  setCheck,
}: TargetFormInputProps) => {
  const tProfile = useTranslations('Profile.progressBar');

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
      setCheck(e.target.checked);
    }
  };

  const handleTextFieldChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCheck(Number(e.target.value) > 0 ? true : false);
    setLatestTarget(Number(e.target.value));
  };

  const getLighterColor = useMemo(() => {
    switch (dataType) {
      case 'treesPlanted':
        return check
          ? { background: `${greenHazeColor}` }
          : { background: `${lightGrayColor}` };
      case 'areaRestored':
        return check
          ? { background: `${amethystPurpleColor}` }
          : { background: `${lightGrayColor}` };
      case 'areaConserved':
        return check
          ? { background: `${ceruleanBlueColor}` }
          : { background: `${lightGrayColor}` };
      default:
        return {};
    }
  }, [dataType, check]);

  const getDarkerColor = useMemo(() => {
    switch (dataType) {
      case 'treesPlanted':
        return check
          ? { background: `${primaryDarkColor}` }
          : { background: `${mediumGrayColor}` };
      case 'areaRestored':
        return check
          ? { background: `${electricPurpleColor}` }
          : { background: `${mediumGrayColor}` };
      case 'areaConserved':
        return check
          ? { background: `${mediumBlueColor}` }
          : { background: `${mediumGrayColor}` };
      default:
        return {};
    }
  }, [dataType, check]);

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
        return tProfile('plantedTreesTarget');
      case 'areaRestored':
        return tProfile('areaRestoredTarget');
      case 'areaConserved':
        return tProfile('areaConservedTarget');
      default:
        return '';
    }
  }, [dataType, target]);

  const targetStatus = useMemo(
    () =>
      check
        ? targetModalStyle.targetFormInputContainer
        : targetModalStyle.deActivateTargetModal,
    [dataType, check, target]
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
    <div className={`${targetStatus} ${dataType}`} style={getLighterColor}>
      <div className={targetModalStyle.switchContainer}>
        <IconAndLabel />
        <TargetSwitch
          switchColor={getColor}
          checked={check}
          onChange={handleSwitchChange}
        />
      </div>
      <TargetTextField
        type="number"
        variant="outlined"
        focusColor={getColor}
        onChange={handleTextFieldChange}
        value={latestTarget || ''}
        placeholder={tProfile('enterYourTarget')}
      />
    </div>
  );
};

export default TargetFormInput;
