import targetModalStyle from './ForestProgressBar.module.scss';
import { useTranslations } from 'next-intl';
import themeProperties from '../../../../theme/themeProperties';
import { ChangeEvent, useMemo, useEffect } from 'react';
import TargetSwitch from './TargetSwitch';
import TargetTextField from './TargetTextField';
import { SetState } from '../../../common/types/common';
import TargetModalIconLabel from './microComponents/TargetModalIconLabel';
import { DataType } from './ForestProgressItem';

type TargetFormInputProps = {
  dataType: DataType;
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

  const { primaryDarkColor, electricPurpleColor, mediumBlueColor } =
    themeProperties;

  useEffect(() => {
    if (target) setLatestTarget(target);
  }, []);

  const handleTargetSwitch = (e: ChangeEvent<HTMLInputElement>) => {
    if (target > 0) {
      setCheck(e.target.checked);
    }
  };

  const handleTargetTextField = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCheck(Number(e.target.value) > 0 ? true : false);
    setLatestTarget(Number(e.target.value));
  };

  const targetColor = () => {
    switch (dataType) {
      case 'treesPlanted':
        return primaryDarkColor;
      case 'areaRestored':
        return electricPurpleColor;
      case 'areaConserved':
        return mediumBlueColor;
    }
  };

  const targetContainerClass = useMemo(
    () =>
      check
        ? targetModalStyle.targetFormInputContainer
        : targetModalStyle.deActivateTargetModal,
    [dataType, check, target]
  );

  return (
    <div className={`${targetContainerClass} ${dataType}`}>
      <div className={targetModalStyle.switchContainer}>
        <TargetModalIconLabel dataType={dataType} target={target} />
        <TargetSwitch
          switchColor={targetColor() ?? ''}
          checked={check}
          onChange={handleTargetSwitch}
        />
      </div>
      <TargetTextField
        type="number"
        variant="outlined"
        focusColor={targetColor() ?? ''}
        onChange={handleTargetTextField}
        value={latestTarget || ''}
        placeholder={tProfile('enterYourTarget')}
      />
    </div>
  );
};

export default TargetFormInput;
