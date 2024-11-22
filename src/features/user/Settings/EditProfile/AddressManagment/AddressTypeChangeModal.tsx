import {
  ADDRESS_ACTIONS,
  ADDRESS_TYPE,
  formatAddress,
} from '../../../../../utils/addressManagement';
import styles from './AddressManagement.module.scss';
import { useTranslations } from 'next-intl';
import WebappButton from '../../../../common/WebappButton';
import { SetState } from '../../../../common/types/common';
import { putAuthenticatedRequest } from '../../../../../utils/apiRequests/api';
import { UpdatedAddress } from '.';
import { useTenant } from '../../../../common/Layout/TenantContext';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import { useContext, useMemo, useState } from 'react';
import { ErrorHandlingContext } from '../../../../common/Layout/ErrorHandlingContext';
import { APIError, CountryCode, handleError } from '@planet-sdk/common';
import { CircularProgress } from '@mui/material';

interface Props {
  setIsModalOpen: SetState<boolean>;
  primaryAddress: UpdatedAddress | undefined;
  billingAddress: UpdatedAddress | undefined;
  addressAction: 'setPrimary' | 'setBilling';
  selectedAddressForAction: UpdatedAddress | null;
  fetchUserAddresses: () => Promise<void>;
}

const AddressTypeChangeModal = ({
  setIsModalOpen,
  primaryAddress,
  billingAddress,
  addressAction,
  selectedAddressForAction,
  fetchUserAddresses,
}: Props) => {
  const tProfile = useTranslations('Profile.addressManagement');
  const tCommon = useTranslations('Common');
  const tCountry = useTranslations('Country');
  const { contextLoaded, user, token, logoutUser } = useUserProps();
  const { tenantConfig } = useTenant();
  const { setErrors } = useContext(ErrorHandlingContext);
  const [isUploadingData, setIsUploadingData] = useState(false);
  const isSetPrimaryAction = addressAction === ADDRESS_ACTIONS.SET_PRIMARY;
  const isSetBillingAction = addressAction === ADDRESS_ACTIONS.SET_BILLING;
  const isBillingAddressAlreadyPresent = isSetBillingAction && billingAddress;
  const isPrimaryAddressAlreadyPresent = isSetPrimaryAction && primaryAddress;

  const getCountryFullForm = (countryCode: string | undefined) => {
    return countryCode
      ? tCountry(countryCode.toLowerCase() as Lowercase<CountryCode>)
      : '';
  };
  const getFormattedAddress = (address: UpdatedAddress) => {
    const { address: userAddress, zipCode, city, state, country } = address;
    const countryFullForm = getCountryFullForm(country);
    return formatAddress(userAddress, zipCode, city, state, countryFullForm);
  };

  const primaryFormattedAddress = useMemo(
    () => (primaryAddress ? getFormattedAddress(primaryAddress) : null),
    [primaryAddress]
  );
  const billingFormattedAddress = useMemo(
    () => (billingAddress ? getFormattedAddress(billingAddress) : null),
    [billingAddress]
  );

  const updateAddress = async (addressType: 'primary' | 'mailing') => {
    if (!contextLoaded || !user) return;
    setIsUploadingData(true);
    const bodyToSend = {
      type: addressType,
    };
    try {
      const res = await putAuthenticatedRequest<UpdatedAddress>(
        tenantConfig.id,
        `/app/addresses/${selectedAddressForAction?.id}`,
        bodyToSend,
        token,
        logoutUser
      );
      if (res) fetchUserAddresses();
    } catch (error) {
      setErrors(handleError(error as APIError));
    } finally {
      setIsUploadingData(false);
      setIsModalOpen(false);
    }
  };
  return (
    <div className={styles.addrConfirmContainer}>
      <h2>
        {tProfile('addressType', {
          address: isSetPrimaryAction
            ? ADDRESS_TYPE.PRIMARY
            : ADDRESS_TYPE.MAILING,
        })}
      </h2>
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
        <p className={styles.address}>{billingFormattedAddress}</p>
      )}
      {isPrimaryAddressAlreadyPresent && (
        <p className={styles.address}>{primaryFormattedAddress}</p>
      )}

      {!isUploadingData ? (
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
              updateAddress(
                addressAction === ADDRESS_ACTIONS.SET_PRIMARY
                  ? ADDRESS_TYPE.PRIMARY
                  : ADDRESS_TYPE.MAILING
              )
            }
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

export default AddressTypeChangeModal;
