import { useTranslations } from 'next-intl';
import { CircularProgress } from '@mui/material';
import WebappButton from '../../../../common/WebappButton';
import styles from './AddressManagement.module.scss';
import { useAddressOperations } from './useAddressOperations';

interface Props {
  addressId: string;
  handleCancel: () => void;
}

const DeleteAddress = ({ addressId, handleCancel }: Props) => {
  const tAddressManagement = useTranslations('EditProfile.addressManagement');
  const tCommon = useTranslations('Common');
  const { deleteAddress, isLoading } = useAddressOperations();

  const handleDelete = () => deleteAddress(addressId).finally(handleCancel);

  return (
    <div className={styles.addressActionContainer}>
      <h2 className={styles.header}>
        {tAddressManagement('deleteAction.title')}
      </h2>
      <p>
        {tAddressManagement('deleteAction.deleteAddressConfirmationMessage')}
      </p>
      {!isLoading ? (
        <div className={styles.buttonContainer}>
          <WebappButton
            text={tCommon('cancel')}
            elementType="button"
            variant="secondary"
            onClick={handleCancel}
          />
          <WebappButton
            text={tAddressManagement('deleteAction.deleteButton')}
            elementType="button"
            variant="primary"
            onClick={handleDelete}
          />
        </div>
      ) : (
        <div className={styles.loadingSpinner}>
          <CircularProgress color="success" />
        </div>
      )}
    </div>
  );
};
export default DeleteAddress;
