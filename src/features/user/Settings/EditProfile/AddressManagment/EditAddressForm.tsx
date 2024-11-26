import type { AddressSuggestionsType } from '../../../../common/types/geocoder';
import type { ExtendedCountryCode } from '../../../../common/types/country';
import type { SetState } from '../../../../common/types/common';
import type { Address, APIError } from '@planet-sdk/common';

import { useState, useContext, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { CircularProgress } from '@mui/material';
import { handleError } from '@planet-sdk/common';
import styles from './AddressManagement.module.scss';
import WebappButton from '../../../../common/WebappButton';
import COUNTRY_ADDRESS_POSTALS from '../../../../../utils/countryZipCode';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import { putAuthenticatedRequest } from '../../../../../utils/apiRequests/api';
import { useTenant } from '../../../../common/Layout/TenantContext';
import { ErrorHandlingContext } from '../../../../common/Layout/ErrorHandlingContext';
import { useDebouncedEffect } from '../../../../../utils/useDebouncedEffect';
import AddressFormInputs from './microComponents/AddressFormInputs';
import {
  fetchAddressDetails,
  geocoder,
  suggestAddress,
} from '../../../../../utils/addressManagement';

export type FormData = {
  address: string | undefined;
  address2: string | null;
  city: string | undefined;
  zipCode: string | undefined;
  state: string | null;
};

interface Props {
  setIsModalOpen: SetState<boolean>;
  selectedAddressForAction: Address | null;
  fetchUserAddresses?: () => Promise<void>;
}

const EditAddressForm = ({
  setIsModalOpen,
  selectedAddressForAction,
  fetchUserAddresses,
}: Props) => {
  const defaultAddressDetail = {
    address: selectedAddressForAction?.address,
    address2: selectedAddressForAction?.address2,
    city: selectedAddressForAction?.city,
    zipCode: selectedAddressForAction?.zipCode,
    state: selectedAddressForAction?.state,
  };
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onBlur',
    defaultValues: defaultAddressDetail,
  });

  const tProfile = useTranslations('Profile.addressManagement');
  const tCommon = useTranslations('Common');
  const { contextLoaded, user, token, logoutUser } = useUserProps();
  const { tenantConfig } = useTenant();
  const { setErrors } = useContext(ErrorHandlingContext);
  const [country, setCountry] = useState<ExtendedCountryCode | ''>(
    selectedAddressForAction?.country ?? 'DE'
  );
  const [addressSuggestions, setAddressSuggestions] = useState<
    AddressSuggestionsType[]
  >([]);
  const [inputValue, setInputValue] = useState('');
  const [isUploadingData, setIsUploadingData] = useState(false);

  const handleSuggestAddress = useCallback(
    async (value: string) => {
      const suggestions = await suggestAddress(value, country);
      setAddressSuggestions(suggestions);
    },
    [geocoder, country]
  );

  const handleGetAddress = useCallback(
    async (value: string) => {
      const details = await fetchAddressDetails(value);
      if (details) {
        setValue('address', details.address, { shouldValidate: true });
        setValue('city', details.city, { shouldValidate: true });
        setValue('zipCode', details.zipCode, { shouldValidate: true });
      }
      setAddressSuggestions([]);
    },
    [geocoder, setValue]
  );
  useDebouncedEffect(
    () => {
      if (inputValue) {
        handleSuggestAddress(inputValue);
      }
    },
    700,
    [inputValue]
  );

  const postalRegex = useMemo(() => {
    const filteredCountry = COUNTRY_ADDRESS_POSTALS.find(
      (item) => item.abbrev === country
    );
    return filteredCountry?.postal;
  }, [country]);

  const resetForm = () => {
    reset(defaultAddressDetail);
    setAddressSuggestions([]);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    resetForm();
  };
  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const handleAddressSelect = (address: string) => {
    handleGetAddress(address);
  };

  const updateAddress = async (data: FormData) => {
    if (!contextLoaded || !user) return;
    setIsUploadingData(true);
    const bodyToSend = {
      ...data,
      country,
      type: selectedAddressForAction?.type,
    };
    try {
      const res = await putAuthenticatedRequest<Address>(
        tenantConfig.id,
        `/app/addresses/${selectedAddressForAction?.id}`,
        bodyToSend,
        token,
        logoutUser
      );
      if (res && fetchUserAddresses) {
        fetchUserAddresses();
        handleCancel();
      }
    } catch (error) {
      setIsUploadingData(false);
      setErrors(handleError(error as APIError));
    } finally {
      setIsUploadingData(false);
    }
  };

  return (
    <div className={styles.addressFormContainer}>
      <h2>{tProfile('formType.edit')}</h2>
      <AddressFormInputs
        handleInputChange={handleInputChange}
        handleAddressSelect={handleAddressSelect}
        addressSuggestions={addressSuggestions}
        control={control}
        errors={errors}
        postalRegex={postalRegex}
        country={country}
        setCountry={setCountry}
      />
      {isUploadingData ? (
        <div className={styles.addressMgmtSpinner}>
          <CircularProgress color="success" />
        </div>
      ) : (
        <div className={styles.formButtonContainer}>
          <WebappButton
            text={tCommon('cancel')}
            variant="secondary"
            elementType="button"
            onClick={handleCancel}
            buttonClasses={styles.cancelButton}
          />
          <WebappButton
            text={tProfile('saveChanges')}
            variant="primary"
            elementType="button"
            onClick={handleSubmit(updateAddress)}
            buttonClasses={styles.addAddressButton}
          />
        </div>
      )}
    </div>
  );
};

export default EditAddressForm;
