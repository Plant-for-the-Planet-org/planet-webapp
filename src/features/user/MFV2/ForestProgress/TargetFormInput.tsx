import styles from './ForestProgress.module.scss';
import { useTranslations } from 'next-intl';
import { targetColor } from '../../../../utils/myForestV2Utils';
import { ChangeEvent, useMemo, useEffect } from 'react';
import TargetSwitch from './TargetSwitch';
import TargetTextField from './TargetTextField';
import { SetState } from '../../../common/types/common';
import TargetFormInputLabel from './microComponents/TargetFormInputLabel';
import { ProgressDataType } from './ForestProgressItem';

type TargetFormInputProps = {
  dataType: ProgressDataType;
  target: number;
  latestTarget: number;
  setLatestTarget: SetState<number>;
  checked: boolean;
  setChecked: SetState<boolean>;
};

const TargetFormInput = ({
  dataType,
  target,
  latestTarget,
  setLatestTarget,
  checked,
  setChecked,
}: TargetFormInputProps) => {
  const tProfile = useTranslations('Profile.progressBar');

  useEffect(() => {
    if (target) setLatestTarget(target);
  }, []);

  const handleTargetSwitch = (e: ChangeEvent<HTMLInputElement>) => {
    if (target > 0) {
      setChecked(e.target.checked);
    }
  };

  const handleTargetTextField = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = e.target.value;
    setChecked(Number(newValue) > 0 ? true : false);
    // Allow empty value or integer only
    if (newValue === '' || /^[0-9]+$/.test(newValue)) {
      setLatestTarget(Number(e.target.value));
    }
  };

  const targetContainerClass = useMemo(
    () =>
      checked ? styles.targetFormInputContainer : styles.deActivateTargetModal,
    [dataType, checked, target]
  );
  const isTargetSet = target > 0 || latestTarget > 0;
  const isChecked = checked;

  return (
    <div
      className={`${targetContainerClass} ${
        isTargetSet && isChecked && styles[dataType]
      }`}
    >
      <div className={styles.switchContainer}>
        <TargetFormInputLabel dataType={dataType} />
        <TargetSwitch
          switchColor={targetColor(dataType) ?? ''}
          checked={checked}
          onChange={handleTargetSwitch}
        />
      </div>
      <TargetTextField
        type="number"
        variant="outlined"
        focusColor={targetColor(dataType) ?? ''}
        onChange={handleTargetTextField}
        value={latestTarget || ''}
        placeholder={tProfile('enterYourTarget')}
      />
    </div>
  );
};

export default TargetFormInput;
