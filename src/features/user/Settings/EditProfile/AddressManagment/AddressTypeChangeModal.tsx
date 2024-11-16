import { ADDRESS_TYPE } from '../../../../../utils/addressManagement';
import styles from './AddressManagement.module.scss';
import { useTranslations } from 'next-intl';
import WebappButton from '../../../../common/WebappButton';
import { SetState } from '../../../../common/types/common';
import { AddressFormData } from './AddressFormModal';

interface Props {
  setIsModalOpen: SetState<boolean>;
  editAddress: (
    data: AddressFormData | null,
    addressType: string
  ) => Promise<void>;
  primaryAddress: string | undefined;
  billingAddress: string | undefined;
  isSetBillingAction: boolean;
  isSetPrimaryAction: boolean;
}

const AddressTypeChangeModal = ({
  setIsModalOpen,
  editAddress,
  primaryAddress,
  billingAddress,
  isSetBillingAction,
  isSetPrimaryAction,
}: Props) => {
  const tProfile = useTranslations('Profile.addressManagement');
  const tCommon = useTranslations('Common');
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
          billingAddress:
            isSetBillingAction && billingAddress ? ADDRESS_TYPE.MAILING : '',
          primaryAddress:
            isSetPrimaryAction && primaryAddress ? ADDRESS_TYPE.PRIMARY : '',
        })}
      </p>
      {billingAddress && isSetBillingAction && (
        <p className={styles.address}>{billingAddress}</p>
      )}
      {primaryAddress && isSetPrimaryAction && (
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
