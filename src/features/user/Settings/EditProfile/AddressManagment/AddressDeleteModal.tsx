import { SetState } from '../../../../common/types/common';
import WebappButton from '../../../../common/WebappButton';
import styles from './AddressManagement.module.scss';
import { useTranslations } from 'next-intl';

interface Props {
  setIsModalOpen: SetState<boolean>;
  deleteAddress: () => Promise<void>;
}

const AddressDeleteModal = ({ setIsModalOpen, deleteAddress }: Props) => {
  const tProfile = useTranslations('Profile.addressManagement');
  const tCommon = useTranslations('Common');
  return (
    <div className={styles.addrConfirmContainer}>
      <h1 className={styles.addressActionHeader}>
        {tProfile('deleteAddress')}
      </h1>
      <p>{tProfile('deleteAddressConfirmationMessage')}</p>
      <div className={styles.buttonContainer}>
        <WebappButton
          text={tCommon('cancel')}
          elementType="button"
          variant="secondary"
          onClick={() => setIsModalOpen(false)}
        />
        <WebappButton
          text={tProfile('delete')}
          elementType="button"
          variant="primary"
          onClick={deleteAddress}
        />
      </div>
    </div>
  );
};

export default AddressDeleteModal;
