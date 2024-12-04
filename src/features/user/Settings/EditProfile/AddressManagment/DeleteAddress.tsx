import type { SetState } from '../../../../common/types/common';
import type { APIError } from '@planet-sdk/common';

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
}

const DeleteAddress = ({
  setIsModalOpen,
  addressId,
  updateUserAddresses,
}: Props) => {
  const tProfile = useTranslations('Profile.addressManagement');
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
    }
  };
  return (
    <div className={styles.addrConfirmContainer}>
      <h2 className={styles.header}>{tProfile('deleteAddress')}</h2>
      <p>{tProfile('deleteAddressConfirmationMessage')}</p>
      {!isLoading ? (
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
export default DeleteAddress;
