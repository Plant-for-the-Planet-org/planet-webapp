import type { SetState } from '../../../../../common/types/common';

import { useTranslations } from 'next-intl';
import NewToggleSwitch from '../../../../../common/InputTypes/NewToggleSwitch';
import styles from '../AddressManagement.module.scss';

interface Props {
  primaryAddressChecked: boolean;
  setPrimaryAddressChecked: SetState<boolean>;
}

const PrimaryAddressToggle = ({
  primaryAddressChecked,
  setPrimaryAddressChecked,
}: Props) => {
  const t = useTranslations('EditProfile');

  return (
    <div className={styles.toggleContainer}>
      <span>{t('addressManagement.actions.setAsPrimaryAddress')}</span>
      <NewToggleSwitch
        checked={primaryAddressChecked}
        onChange={(e) => setPrimaryAddressChecked(e.target.checked)}
      />
    </div>
  );
};

export default PrimaryAddressToggle;
