import type { SetState } from '../../../../common/types/common';
import type { APIError } from '@planet-sdk/common';
import type { AddressAction } from '../../../../common/types/profile';

import { useContext, useState } from 'react';
import { useTranslations } from 'next-intl';
import { handleError } from '@planet-sdk/common';
import { CircularProgress } from '@mui/material';
import { ErrorHandlingContext } from '../../../../common/Layout/ErrorHandlingContext';
import { useTenant } from '../../../../common/Layout/TenantContext';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import WebappButton from '../../../../common/WebappButton';
import styles from './AddressManagement.module.scss';
import { deleteAuthenticatedRequest } from '../../../../../utils/apiRequests/api';

interface Props {
  setIsModalOpen: SetState<boolean>;
  addressId: string | undefined;
  updateUserAddresses: () => Promise<void>;
  setAddressAction: SetState<AddressAction | null>;
}

const DeleteAddress = ({
  setIsModalOpen,
  addressId,
  updateUserAddresses,
  setAddressAction,
}: Props) => {
  const tAddressManagement = useTranslations('EditProfile.addressManagement');
  const tCommon = useTranslations('Common');
  const { contextLoaded, user, token, logoutUser } = useUserProps();
  const { tenantConfig } = useTenant();
  const { setErrors } = useContext(ErrorHandlingContext);
  const [isLoading, setIsLoading] = useState(false);

  const deleteAddress = async () => {
    if (!contextLoaded || !user || !token) return;
    try {
      setIsLoading(true);
      await deleteAuthenticatedRequest(
        tenantConfig.id,
        `/app/addresses/${addressId}`,
        token,
        logoutUser
      );
      updateUserAddresses();
    } catch (error) {
      setErrors(handleError(error as APIError));
    } finally {
      setIsModalOpen(false);
      setIsLoading(false);
      setAddressAction(null);
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setAddressAction(null);
  };
  return (
    <div className={styles.addressActionContainer}>
      <h2 className={styles.header}>
        {tAddressManagement('deleteAction.deleteAddress')}
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
            text={tAddressManagement('deleteAction.delete')}
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
export default DeleteAddress;
