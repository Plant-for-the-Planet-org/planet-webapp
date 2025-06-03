import type { Address, APIError } from '@planet-sdk/common';
import type { SetState } from '../../../../common/types/common';
import type { AddressAction } from '../../../../common/types/profile';

import { useContext, useState } from 'react';
import { useTranslations } from 'next-intl';
import { CircularProgress } from '@mui/material';
import { handleError } from '@planet-sdk/common';
import styles from './AddressManagement.module.scss';
import WebappButton from '../../../../common/WebappButton';
import { ErrorHandlingContext } from '../../../../common/Layout/ErrorHandlingContext';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import { ADDRESS_TYPE } from '../../../../../utils/addressManagement';
import { useApi } from '../../../../../hooks/useApi';

interface Props {
  addressType: 'mailing';
  setIsModalOpen: SetState<boolean>;
  setAddressAction: SetState<AddressAction | null>;
  selectedAddressForAction: Address;
}

type UnsetBillingAddressApiPayload = {
  type: 'other';
};

const UnsetBillingAddress = ({
  addressType,
  setIsModalOpen,
  setAddressAction,
  selectedAddressForAction,
}: Props) => {
  const tAddressManagement = useTranslations('EditProfile.addressManagement');
  const tCommon = useTranslations('Common');
  const { contextLoaded, user, token, setUser } = useUserProps();
  const { putApiAuthenticated } = useApi();
  const { setErrors } = useContext(ErrorHandlingContext);
  const [isLoading, setIsLoading] = useState(false);

  const unsetAddress = async () => {
    if (!contextLoaded || !user || !token) return;
    setIsLoading(true);
    const payload: UnsetBillingAddressApiPayload = {
      type: ADDRESS_TYPE.OTHER,
    };
    try {
      const res = await putApiAuthenticated<
        Address,
        UnsetBillingAddressApiPayload
      >(`/app/addresses/${selectedAddressForAction.id}`, {
        payload,
      });
      if (res) {
        setUser((prev) => {
          if (!prev) return null;

          const updatedAddresses = prev.addresses.map((addr) =>
            addr.id === selectedAddressForAction.id
              ? { ...addr, type: ADDRESS_TYPE.OTHER }
              : addr
          );

          return {
            ...prev,
            addresses: updatedAddresses,
          };
        });
      }
    } catch (error) {
      setErrors(handleError(error as APIError));
    } finally {
      setIsLoading(false);
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
        {tAddressManagement('updateAddressType.unsetBillingAddressMessage')}
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
            text={tAddressManagement('updateAddressType.confirmButton')}
            elementType="button"
            variant="primary"
            onClick={unsetAddress}
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

export default UnsetBillingAddress;
