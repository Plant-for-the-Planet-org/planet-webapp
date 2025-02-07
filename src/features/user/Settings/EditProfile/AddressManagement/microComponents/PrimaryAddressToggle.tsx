import type { SetState } from '../../../../../common/types/common';

import { useTranslations } from 'next-intl';
import NewToggleSwitch from '../../../../../common/InputTypes/NewToggleSwitch';
import styles from '../AddressManagement.module.scss';

interface Props {
  checkedPrimaryAddress: boolean;
  setCheckedPrimaryAddress: SetState<boolean>;
}

const PrimaryAddressToggle = ({
  checkedPrimaryAddress,
  setCheckedPrimaryAddress,
}: Props) => {
  const t = useTranslations('EditProfile');

  return (
    <div className={styles.toggleContainer}>
      <span>{t('addressManagement.actions.setAsPrimaryAddress')}</span>
      <NewToggleSwitch
        checked={checkedPrimaryAddress}
        onChange={(e) => setCheckedPrimaryAddress(e.target.checked)}
      />
    </div>
  );
};

export default PrimaryAddressToggle;
