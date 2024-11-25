import type {
  AddressSuggestionsType,
  AddressType,
} from '../../../../common/types/geocoder';
import type { ExtendedCountryCode } from '../../../../common/types/country';
import type { SetState } from '../../../../common/types/common';
import type { Address, APIError } from '@planet-sdk/common';

import { useState, useContext, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { CircularProgress } from '@mui/material';
import GeocoderArcGIs from 'geocoder-arcgis';
import styles from './AddressManagement.module.scss';
import WebappButton from '../../../../common/WebappButton';
import COUNTRY_ADDRESS_POSTALS from '../../../../../utils/countryZipCode';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import { postAuthenticatedRequest } from '../../../../../utils/apiRequests/api';
import { useTenant } from '../../../../common/Layout/TenantContext';
import { ErrorHandlingContext } from '../../../../common/Layout/ErrorHandlingContext';
import { useDebouncedEffect } from '../../../../../utils/useDebouncedEffect';
import AddressFormInputs from './microComponents/AddressFormInputs';
import { handleError } from '@planet-sdk/common';

export type FormData = {
  address: string;
  address2: string | undefined;
  city: string;
  zipCode: string;
  state: string;
};

interface Props {
  formType: string;
  setIsModalOpen: SetState<boolean>;
  setUserAddresses: SetState<Address[]>;
}
const geocoder = new GeocoderArcGIs(
  process.env.ESRI_CLIENT_SECRET
    ? {
        client_id: process.env.ESRI_CLIENT_ID,
        client_secret: process.env.ESRI_CLIENT_SECRET,
      }
    : {}
);
const AddressForm = ({ formType, setIsModalOpen, setUserAddresses }: Props) => {
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

  const tProfile = useTranslations('Profile');
  const tCommon = useTranslations('Common');
  const { contextLoaded, user, token, logoutUser } = useUserProps();
  const { tenantConfig } = useTenant();
  const { setErrors } = useContext(ErrorHandlingContext);
  const [country, setCountry] = useState<ExtendedCountryCode | ''>(
    user?.country || 'DE'
  );
  const [addressSuggestions, setAddressSuggestions] = useState<
    AddressSuggestionsType[]
  >([]);
  const [inputValue, setInputValue] = useState('');
  const [isUploadingData, setIsUploadingData] = useState(false);

  const suggestAddress = useCallback(
    (value: string) => {
      if (value.length > 3) {
        geocoder
          .suggest(value, { category: 'Address', countryCode: country })
          .then((result: { suggestions: AddressSuggestionsType[] }) => {
            const filterdSuggestions = result.suggestions.filter(
              (suggestion: AddressSuggestionsType) => {
                return !suggestion.isCollection;
              }
            );
            setAddressSuggestions(filterdSuggestions);
          })
          .catch(console.log);
      }
    },
    [country, geocoder]
  );

  useDebouncedEffect(
    () => {
      if (inputValue) {
        suggestAddress(inputValue);
      }
    },
    700,
    [inputValue]
  );

  const getAddress = (value: string) => {
    geocoder
      .findAddressCandidates(value, { outfields: '*' })
      .then((result: AddressType) => {
        setValue('address', result.candidates[0].attributes.ShortLabel, {
          shouldValidate: true,
        });
        setValue('city', result.candidates[0].attributes.City, {
          shouldValidate: true,
        });
        setValue('zipCode', result.candidates[0].attributes.Postal, {
          shouldValidate: true,
        });
        setAddressSuggestions([]);
      })
      .catch(console.log);
  };

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

  const addAddress = async (data: FormData) => {
    setIsUploadingData(true);
    const bodyToSend = {
      ...data,
      country,
      type: 'other',
    };
    if (contextLoaded && user) {
      try {
        const res = await postAuthenticatedRequest<Address>(
          tenantConfig.id,
          '/app/addresses',
          bodyToSend,
          token,
          logoutUser
        );
        if (res) {
          setUserAddresses((prevAddresses) => [...prevAddresses, res]);
          handleCancel();
        }
      } catch (error) {
        resetForm();
        setIsUploadingData(false);
        setErrors(handleError(error as APIError));
      } finally {
        setIsUploadingData(false);
      }
    }
  };
  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const handleAddressSelect = (address: string) => {
    getAddress(address);
  };

  return (
    <div className={styles.addressFormContainer}>
      <h2>{tProfile('addressManagement.addAddress')}</h2>
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
            text={tProfile('addressManagement.addAddress')}
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

export default AddressForm;
