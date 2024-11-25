import type {
  AddressSuggestionsType,
  AddressType,
} from '../../../../common/types/geocoder';
import type { ExtendedCountryCode } from '../../../../common/types/country';
import type { SetState } from '../../../../common/types/common';
import type { Address, APIError } from '@planet-sdk/common';
import type { AddressAction } from '../../../../common/types/profile';

import { useState, useContext, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { CircularProgress } from '@mui/material';
import GeocoderArcGIs from 'geocoder-arcgis';
import { handleError } from '@planet-sdk/common';
import styles from './AddressManagement.module.scss';
import WebappButton from '../../../../common/WebappButton';
import COUNTRY_ADDRESS_POSTALS from '../../../../../utils/countryZipCode';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import {
  postAuthenticatedRequest,
  putAuthenticatedRequest,
} from '../../../../../utils/apiRequests/api';
import { useTenant } from '../../../../common/Layout/TenantContext';
import { ErrorHandlingContext } from '../../../../common/Layout/ErrorHandlingContext';
import {
  ADDRESS_FORM_TYPE,
  ADDRESS_TYPE,
} from '../../../../../utils/addressManagement';
import { useDebouncedEffect } from '../../../../../utils/useDebouncedEffect';
import AddressFormInputs from './microComponents/AddressFormInputs';

export type AddressFormData = {
  address: string | undefined;
  address2: string | null;
  city: string | undefined;
  zipCode: string | undefined;
  state: string | null;
};

type AddressFormType =
  (typeof ADDRESS_FORM_TYPE)[keyof typeof ADDRESS_FORM_TYPE];
interface Props {
  formType: AddressFormType;
  setIsModalOpen: SetState<boolean>;
  setUserAddresses?: SetState<Address[]>;
  selectedAddressForAction?: Address | null;
  addressAction?: AddressAction | null;
  fetchUserAddresses?: () => Promise<void>;
}
const geocoder = new GeocoderArcGIs(
  process.env.ESRI_CLIENT_SECRET
    ? {
        client_id: process.env.ESRI_CLIENT_ID,
        client_secret: process.env.ESRI_CLIENT_SECRET,
      }
    : {}
);
const AddressForm = ({
  addressAction,
  formType,
  setIsModalOpen,
  setUserAddresses,
  selectedAddressForAction,
  fetchUserAddresses,
}: Props) => {
  const defaultAddressDetail = {
    address: selectedAddressForAction ? selectedAddressForAction.address : '',
    address2: selectedAddressForAction ? selectedAddressForAction.address2 : '',
    city: selectedAddressForAction ? selectedAddressForAction.city : '',
    zipCode: selectedAddressForAction ? selectedAddressForAction.zipCode : '',
    state: selectedAddressForAction ? selectedAddressForAction.state : '',
  };
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AddressFormData>({
    mode: 'onBlur',
    defaultValues: defaultAddressDetail,
  });

  const tProfile = useTranslations('Profile');
  const tCommon = useTranslations('Common');
  const { contextLoaded, user, token, logoutUser } = useUserProps();
  const { tenantConfig } = useTenant();
  const { setErrors } = useContext(ErrorHandlingContext);
  const isAddAddressForm = formType === ADDRESS_FORM_TYPE.ADD_ADDRESS;
  const userCountry = isAddAddressForm
    ? user?.country
    : selectedAddressForAction?.country;
  const [country, setCountry] = useState<ExtendedCountryCode | ''>(
    userCountry ?? 'DE'
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

  const updateAddress = async (data: AddressFormData) => {
    if (!addressAction || !selectedAddressForAction || formType === 'add')
      return;
    setIsUploadingData(true);
    const bodyToSend = {
      ...data,
      country,
      type: selectedAddressForAction.type,
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
      setErrors(handleError(error as APIError));
    } finally {
      setIsUploadingData(false);
      setIsModalOpen(false);
    }
  };

  const addAddress = async (data: AddressFormData) => {
    setIsUploadingData(true);
    const bodyToSend = {
      ...data,
      country,
      type: ADDRESS_TYPE.OTHER,
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
        if (res && setUserAddresses) {
          setUserAddresses((prevAddresses) => [...prevAddresses, res]);
          handleCancel();
        }
      } catch (error) {
        resetForm();
        setErrors(handleError(error as APIError));
      } finally {
        setIsUploadingData(false);
        setIsModalOpen(false);
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
      <h2>{tProfile(`addressManagement.formType.${formType}`)}</h2>
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
      {!isUploadingData ? (
        <div className={styles.buttonContainer}>
          <WebappButton
            text={tCommon('cancel')}
            variant="secondary"
            elementType="button"
            onClick={handleCancel}
            buttonClasses={styles.cancelButton}
          />
          <WebappButton
            text={
              isAddAddressForm
                ? tProfile(`addressManagement.formType.${formType}`)
                : tProfile('addressManagement.saveChanges')
            }
            variant="primary"
            elementType="button"
            onClick={handleSubmit(
              isAddAddressForm ? addAddress : updateAddress
            )}
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

export default AddressForm;
