import type { SetState } from '../../../../common/types/common';
import type { APIError, CountryCode, Address } from '@planet-sdk/common';

import { formatAddress } from '../../../../../utils/addressManagement';
import styles from './AddressManagement.module.scss';
import { useTranslations } from 'next-intl';
import WebappButton from '../../../../common/WebappButton';
import { putAuthenticatedRequest } from '../../../../../utils/apiRequests/api';
import { useTenant } from '../../../../common/Layout/TenantContext';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import { useContext, useMemo, useState } from 'react';
import { ErrorHandlingContext } from '../../../../common/Layout/ErrorHandlingContext';
import { handleError } from '@planet-sdk/common';
import { CircularProgress } from '@mui/material';

interface Props {
  type: 'primary' | 'mailing';
  setIsModalOpen: SetState<boolean>;
  address: Address | undefined;
  selectedAddressForAction: Address | null;
  fetchUserAddresses: () => Promise<void>;
}

const AddressTypeConfirmationModal = ({
  type,
  setIsModalOpen,
  address,
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

  const getCountryFullForm = (countryCode: string | undefined) => {
    return countryCode
      ? tCountry(countryCode.toLowerCase() as Lowercase<CountryCode>)
      : '';
  };
  const getFormattedAddress = (address: Address) => {
    const { address: userAddress, zipCode, city, state, country } = address;
    const countryFullForm = getCountryFullForm(country);
    return formatAddress(userAddress, zipCode, city, state, countryFullForm);
  };

  const formattedAddress = useMemo(
    () => (address ? getFormattedAddress(address) : null),
    [address]
  );

  const updateAddress = async (addressType: 'primary' | 'mailing') => {
    if (!contextLoaded || !user) return;
    setIsUploadingData(true);
    const bodyToSend = {
      type: addressType,
    };
    try {
      const res = await putAuthenticatedRequest<Address>(
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
      <h2>{tProfile(`addressType.${type}`)}</h2>
      <p>
        {tProfile('addressConfirmationMessage', {
          addressType: type,
          isAddressSet: !!address,
        })}
      </p>
      {formattedAddress && <p className={styles.address}>{formattedAddress}</p>}
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
            onClick={() => updateAddress(type)}
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

export default AddressTypeConfirmationModal;
