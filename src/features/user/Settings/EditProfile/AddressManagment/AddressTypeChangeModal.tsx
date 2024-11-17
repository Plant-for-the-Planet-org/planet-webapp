import {
  ADDRESS_ACTIONS,
  ADDRESS_TYPE,
} from '../../../../../utils/addressManagement';
import styles from './AddressManagement.module.scss';
import { useTranslations } from 'next-intl';
import WebappButton from '../../../../common/WebappButton';
import { SetState } from '../../../../common/types/common';
import { AddressFormData } from './AddressFormModal';
import { AddressAction } from './microComponents/AddressActionMenu';

interface Props {
  setIsModalOpen: SetState<boolean>;
  editAddress: (
    data: AddressFormData | null,
    addressType: string
  ) => Promise<void>;
  primaryAddress: string | null;
  billingAddress: string | null;
  addressAction: AddressAction;
}

const AddressTypeChangeModal = ({
  setIsModalOpen,
  editAddress,
  primaryAddress,
  billingAddress,
  addressAction,
}: Props) => {
  const tProfile = useTranslations('Profile.addressManagement');
  const tCommon = useTranslations('Common');
  const isSetPrimaryAction = addressAction === ADDRESS_ACTIONS.SET_PRIMARY;
  const isSetBillingAction = addressAction === ADDRESS_ACTIONS.SET_BILLING;
  const isBillingAddressAlreadyPresent = isSetBillingAction && billingAddress;
  const isPrimaryAddressAlreadyPresent = isSetPrimaryAction && primaryAddress;
  return (
    <div className={styles.addrConfirmContainer}>
      <h1 className={styles.addressActionHeader}>
        {tProfile('addressType', {
          address: isSetPrimaryAction
            ? ADDRESS_TYPE.PRIMARY
            : ADDRESS_TYPE.MAILING,
        })}
      </h1>
      <p>
        {tProfile('addressConfirmationMessage', {
          addressType: isSetBillingAction
            ? ADDRESS_TYPE.MAILING
            : ADDRESS_TYPE.PRIMARY,
          billingAddress: isBillingAddressAlreadyPresent
            ? ADDRESS_TYPE.MAILING
            : '',
          primaryAddress: isPrimaryAddressAlreadyPresent
            ? ADDRESS_TYPE.PRIMARY
            : '',
        })}
      </p>
      {isBillingAddressAlreadyPresent && (
        <p className={styles.address}>{billingAddress}</p>
      )}
      {isPrimaryAddressAlreadyPresent && (
        <p className={styles.address}>{primaryAddress}</p>
      )}
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
            editAddress(
              null,
              isSetBillingAction ? ADDRESS_TYPE.MAILING : ADDRESS_TYPE.PRIMARY
            )
          }
        />
      </div>
    </div>
  );
};

export default AddressTypeChangeModal;
