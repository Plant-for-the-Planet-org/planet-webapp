import { ADDRESS_ACTIONS } from '../../../../../utils/addressManagement';
import styles from './AddressManagement.module.scss';
import { useTranslations } from 'next-intl';
import { AddressAction } from './microComponents/AddressActionMenu';
import WebappButton from '../../../../common/WebappButton';
import { SetState } from '../../../../common/types/common';
import { AddressFormData } from './AddressForm';

interface Props {
  addressAction: AddressAction;
  formattedAddress: string;
  setIsModalOpen: SetState<boolean>;
  editAddress: (
    data: AddressFormData | null,
    addressType: string
  ) => Promise<void>;
}

const AddressTypeChange = ({
  addressAction,
  formattedAddress,
  setIsModalOpen,
  editAddress,
}: Props) => {
  const tProfile = useTranslations('Profile.addressManagement');
  const tCommon = useTranslations('Common');
  const isBillingAddress = addressAction === ADDRESS_ACTIONS.SET_BILLING;
  return (
    <div className={styles.addrConfirmContainer}>
      <h1 className={styles.addressActionHeader}>
        {isBillingAddress
          ? tProfile('BillingAddress')
          : tProfile('primaryAddress')}
      </h1>
      <p>
        {tProfile('addressConfirmationMessage', {
          addressType: isBillingAddress ? 'Billing' : 'Primary',
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
          onClick={() =>
            editAddress(null, isBillingAddress ? 'mailing' : 'primary')
          }
        />
      </div>
    </div>
  );
};

export default AddressTypeChange;
