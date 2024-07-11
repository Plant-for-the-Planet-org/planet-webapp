import styles from './ForestProgress.module.scss';
import { useTranslations } from 'next-intl';
import { targetColor } from '../../../../utils/myForestV2Utils';
import { ChangeEvent, useMemo } from 'react';
import TargetSwitch from './TargetSwitch';
import TargetTextField from './TargetTextField';
import { SetState } from '../../../common/types/common';
import TargetFormInputLabel from './microComponents/TargetFormInputLabel';
import { ProgressDataType } from './ForestProgressItem';

type TargetFormInputProps = {
  dataType: ProgressDataType;
  localTarget: number;
  setLocalTarget: SetState<number>;
  checked: boolean;
  setChecked: SetState<boolean>;
};

const TargetFormInput = ({
  dataType,
  localTarget,
  setLocalTarget,
  checked,
  setChecked,
}: TargetFormInputProps) => {
  const tProfile = useTranslations('Profile.progressBar');

  const handleTargetSwitch = (e: ChangeEvent<HTMLInputElement>) => {
    if (localTarget > 0) {
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
      setLocalTarget(Number(e.target.value));
    }
  };

  const targetContainerClass = useMemo(
    () =>
      checked ? styles.targetFormInputContainer : styles.deActivateTargetModal,
    [dataType, checked]
  );
  const isLocalTargetSet = localTarget > 0;
  const isChecked = checked;

  return (
    <div
      className={`${targetContainerClass} ${
        isLocalTargetSet && isChecked && styles[dataType]
      }`}
    >
      <div className={styles.switchContainer}>
        <TargetFormInputLabel dataType={dataType} />
        {isLocalTargetSet && (
          <TargetSwitch
            switchColor={targetColor(dataType) ?? ''}
            checked={checked}
            onChange={handleTargetSwitch}
          />
        )}
      </div>
      <TargetTextField
        type="number"
        variant="outlined"
        focusColor={targetColor(dataType) ?? ''}
        onChange={handleTargetTextField}
        value={localTarget || ''}
        placeholder={tProfile('enterYourTarget')}
      />
    </div>
  );
};

export default TargetFormInput;
