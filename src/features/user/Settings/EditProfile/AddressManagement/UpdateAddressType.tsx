import type { SetState } from '../../../../common/types/common';
import type { APIError, Address } from '@planet-sdk/common';
import type { AddressAction } from '../../../../common/types/profile';

import { useContext, useState } from 'react';
import { useTranslations } from 'next-intl';
import { handleError } from '@planet-sdk/common';
import { CircularProgress } from '@mui/material';
import styles from './AddressManagement.module.scss';
import WebappButton from '../../../../common/WebappButton';
import { putAuthenticatedRequest } from '../../../../../utils/apiRequests/api';
import { useTenant } from '../../../../common/Layout/TenantContext';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import { ErrorHandlingContext } from '../../../../common/Layout/ErrorHandlingContext';
import FormattedAddressBlock from './microComponents/FormattedAddressBlock';
import { ADDRESS_TYPE } from '../../../../../utils/addressManagement';

interface Props {
  addressType: 'primary' | 'mailing';
  setIsModalOpen: SetState<boolean>;
  userAddress: Address | undefined;
  selectedAddressForAction: Address;
  setAddressAction: SetState<AddressAction | null>;
}

const UpdateAddressType = ({
  addressType,
  setIsModalOpen,
  userAddress,
  selectedAddressForAction,
  setAddressAction,
}: Props) => {
  const tAddressManagement = useTranslations('EditProfile.addressManagement');
  const tCommon = useTranslations('Common');
  const { contextLoaded, user, token, logoutUser, setUser } = useUserProps();
  const { tenantConfig } = useTenant();
  const { setErrors } = useContext(ErrorHandlingContext);
  const [isUploadingData, setIsUploadingData] = useState(false);

  const updateAddress = async (addressType: 'primary' | 'mailing') => {
    if (!contextLoaded || !user || !token) return;
    setIsUploadingData(true);
    const bodyToSend = {
      type: addressType,
    };
    try {
      const res = await putAuthenticatedRequest<Address>({
        tenant: tenantConfig.id,
        url: `/app/addresses/${selectedAddressForAction.id}`,
        data: bodyToSend,
        token,
        logoutUser,
      });
      if (res)
        setUser((prev) => {
          if (!prev) return null;

          const updatedAddresses = prev.addresses.map((addr) => {
            if (addr.id === selectedAddressForAction.id)
              return { ...addr, type: addressType };

            if (addr.type === addressType)
              return {
                ...addr,
                type: ADDRESS_TYPE.OTHER,
              };

            return addr;
          });
          return {
            ...prev,
            addresses: updatedAddresses,
          };
        });
    } catch (error) {
      setErrors(handleError(error as APIError));
    } finally {
      setIsUploadingData(false);
      setIsModalOpen(false);
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
        {tAddressManagement(`addressType.${addressType}`)}
      </h2>
      <p>
        {tAddressManagement('updateAddressType.setAddressConfirmation', {
          addressType: tAddressManagement(`addressType.${addressType}`),
        })}
        {userAddress &&
          tAddressManagement('updateAddressType.replaceAddressWarning', {
            addressType: tAddressManagement(`addressType.${addressType}`),
          })}
      </p>
      {userAddress !== undefined && (
        <div className={styles.address}>
          <FormattedAddressBlock userAddress={userAddress} />
        </div>
      )}
      {!isUploadingData ? (
        <div className={styles.buttonContainer}>
          <WebappButton
            text={tCommon('cancel')}
            elementType="button"
            variant="secondary"
            onClick={handleCancel}
          />
          <WebappButton
            text={tAddressManagement('updateAddressType.confirmButton')}
            elementType="button"
            variant="primary"
            onClick={() => updateAddress(addressType)}
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

export default UpdateAddressType;
