import { useContext, useState } from 'react';
import { ErrorHandlingContext } from '../../../../common/Layout/ErrorHandlingContext';
import { useTenant } from '../../../../common/Layout/TenantContext';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import { SetState } from '../../../../common/types/common';
import WebappButton from '../../../../common/WebappButton';
import styles from './AddressManagement.module.scss';
import { useTranslations } from 'next-intl';
import { deleteAuthenticatedRequest } from '../../../../../utils/apiRequests/api';
import { APIError, handleError } from '@planet-sdk/common';
import { CircularProgress } from '@mui/material';

interface Props {
  setIsModalOpen: SetState<boolean>;
  addressId: string | undefined;
  fetchUserAddresses: () => Promise<void>;
}

const AddressDeleteModal = ({
  setIsModalOpen,
  addressId,
  fetchUserAddresses,
}: Props) => {
  const tProfile = useTranslations('Profile.addressManagement');
  const tCommon = useTranslations('Common');
  const { contextLoaded, user, token, logoutUser } = useUserProps();
  const { tenantConfig } = useTenant();
  const { setErrors } = useContext(ErrorHandlingContext);
  const [isUploadingData, setIsUploadingData] = useState(false);

  const deleteAddress = async () => {
    if (!contextLoaded || !user) return;
    try {
      setIsUploadingData(true);
      await deleteAuthenticatedRequest(
        tenantConfig.id,
        `/app/addresses/${addressId}`,
        token,
        logoutUser
      );
      fetchUserAddresses();
    } catch (error) {
      setErrors(handleError(error as APIError));
    } finally {
      setIsModalOpen(false);
      setIsUploadingData(false);
    }
  };
  return (
    <div className={styles.addrConfirmContainer}>
      <h2>{tProfile('deleteAddress')}</h2>
      <p>{tProfile('deleteAddressConfirmationMessage')}</p>
      {!isUploadingData ? (
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
      ) : (
        <div className={styles.addressMgmtSpinner}>
          <CircularProgress color="success" />
        </div>
      )}
    </div>
  );
};
export default AddressDeleteModal;
