import type { SetState } from '../../../../common/types/common';
import type { APIError, Address } from '@planet-sdk/common';
import type { AddressAction } from '../../../../common/types/profile';

import { useContext, useState } from 'react';
import { useTranslations } from 'next-intl';
import { handleError } from '@planet-sdk/common';
import { CircularProgress } from '@mui/material';
import styles from './AddressManagement.module.scss';
import WebappButton from '../../../../common/WebappButton';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import { ErrorHandlingContext } from '../../../../common/Layout/ErrorHandlingContext';
import FormattedAddressBlock from './microComponents/FormattedAddressBlock';
import { useApi } from '../../../../../hooks/useApi';

type AddressType = 'primary' | 'mailing';
interface Props {
  addressType: AddressType;
  setIsModalOpen: SetState<boolean>;
  userAddress: Address | undefined;
  selectedAddressForAction: Address;
  updateUserAddresses: () => Promise<void>;
  setAddressAction: SetState<AddressAction | null>;
}

type AddressTypeApiPayload = {
  type: AddressType;
};

const UpdateAddressType = ({
  addressType,
  setIsModalOpen,
  userAddress,
  selectedAddressForAction,
  updateUserAddresses,
  setAddressAction,
}: Props) => {
  const tAddressManagement = useTranslations('EditProfile.addressManagement');
  const tCommon = useTranslations('Common');
  const { contextLoaded, user, token } = useUserProps();
  const { putApiAuthenticated } = useApi();
  const { setErrors } = useContext(ErrorHandlingContext);
  const [isUploadingData, setIsUploadingData] = useState(false);

  const updateAddress = async (addressType: AddressType) => {
    if (!contextLoaded || !user || !token) return;
    setIsUploadingData(true);
    const bodyToSend: AddressTypeApiPayload = {
      type: addressType,
    };
    try {
      const res = await putApiAuthenticated<Address, AddressTypeApiPayload>(
        `/app/addresses/${selectedAddressForAction.id}`,
        {
          payload: bodyToSend,
        }
      );
      if (res) updateUserAddresses();
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
