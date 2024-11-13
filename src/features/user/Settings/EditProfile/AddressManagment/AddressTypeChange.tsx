import { UpdatedAddress } from '.';
import { ADDRESS_ACTIONS } from '../../../../../utils/addressManagement';
import styles from './AddressManagement.module.scss';
import { useTranslations } from 'next-intl';
import { AddressAction } from './microComponents/AddressActionMenu';
import WebappButton from '../../../../common/WebappButton';
import { SetState } from '../../../../common/types/common';

interface Props {
  addressAction: AddressAction;
  formattedAddress: string;
  setIsModalOpen: SetState<boolean>;
}

const AddressTypeChange = ({
  addressAction,
  formattedAddress,
  setIsModalOpen,
}: Props) => {
  const tProfile = useTranslations('Profile.addressManagement');
  const tCommon = useTranslations('Common');
  const changeAddressType = () => {};
  return (
    <div className={styles.addrConfirmContainer}>
      <h1 className={styles.addressActionHeader}>
        {addressAction === ADDRESS_ACTIONS.SET_BILLING
          ? tProfile('BillingAddress')
          : tProfile('primaryAddress')}
      </h1>
      <p>
        {tProfile('addressConfirmationMessage', {
          addressType:
            addressAction === ADDRESS_ACTIONS.SET_BILLING
              ? 'Billing'
              : 'Primary',
        })}
      </p>
      <p className={styles.address}>{formattedAddress}</p>
      <div className={styles.buttonContainer}>
        <WebappButton
          text={tCommon('cancel')}
          elementType="button"
          variant="secondary"
          onClick={() => setIsModalOpen(false)}
        />
        <WebappButton
          text={tProfile('confirm')}
          elementType="button"
          variant="primary"
          onClick={changeAddressType}
        />
      </div>
    </div>
  );
};

export default AddressTypeChange;
