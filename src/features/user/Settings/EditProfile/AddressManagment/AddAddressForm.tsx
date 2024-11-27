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
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import { postAuthenticatedRequest } from '../../../../../utils/apiRequests/api';
import { useTenant } from '../../../../common/Layout/TenantContext';
import { ErrorHandlingContext } from '../../../../common/Layout/ErrorHandlingContext';
import { useDebouncedEffect } from '../../../../../utils/useDebouncedEffect';
import AddressFormInputs from './microComponents/AddressFormInputs';
import {
  ADDRESS_TYPE,
  fetchAddressDetails,
  geocoder,
  getPostalRegex,
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
  setUserAddresses: SetState<Address[]>;
}

const AddAddressForm = ({ setIsModalOpen, setUserAddresses }: Props) => {
  const defaultAddressDetail = {
    address: '',
    address2: '',
    city: '',
    zipCode: '',
    state: '',
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
    user?.country ?? 'DE'
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

  const postalRegex = useMemo(() => getPostalRegex(country), [country]);

  const resetForm = () => {
    reset(defaultAddressDetail);
    setAddressSuggestions([]);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const addAddress = async (data: FormData) => {
    if (!contextLoaded || !user || !token) return;
    setIsUploadingData(true);
    const bodyToSend = {
      ...data,
      country,
      type: ADDRESS_TYPE.OTHER,
    };
    try {
      const res = await postAuthenticatedRequest<Address>(
        tenantConfig.id,
        '/app/addresses',
        bodyToSend,
        token,
        logoutUser
      );
      if (res && setUserAddresses) {
        setUserAddresses((prevAddresses) => [...prevAddresses, res]);
        handleCancel();
      }
    } catch (error) {
      resetForm();
      setIsUploadingData(false);
      setErrors(handleError(error as APIError));
    } finally {
      setIsUploadingData(false);
      setIsModalOpen(false);
    }
  };
  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const handleAddressSelect = (address: string) => {
    handleGetAddress(address);
  };
  return (
    <div className={styles.addressFormContainer}>
      <h2 className={styles.header}>{tProfile('addAddress')}</h2>
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
        <div className={styles.buttonContainer}>
          <WebappButton
            text={tCommon('cancel')}
            variant="secondary"
            elementType="button"
            onClick={handleCancel}
            buttonClasses={styles.cancelButton}
          />
          <WebappButton
            text={tProfile('addAddress')}
            variant="primary"
            elementType="button"
            onClick={handleSubmit(addAddress)}
            buttonClasses={styles.addAddressButton}
          />
        </div>
      )}
    </div>
  );
};

export default AddAddressForm;
