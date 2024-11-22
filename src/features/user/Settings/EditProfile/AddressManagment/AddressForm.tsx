import type {
  AddressSuggestionsType,
  AddressType,
} from '../../../../common/types/geocoder';
import type { ExtendedCountryCode } from '../../../../common/types/country';
import type { SetState } from '../../../../common/types/common';
import type { UpdatedAddress } from '.';

import { useState, useContext, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { CircularProgress } from '@mui/material';
import GeocoderArcGIs from 'geocoder-arcgis';
import { APIError, handleError } from '@planet-sdk/common';
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
import { useDebouncedEffect } from '../../../../../utils/useDebouncedEffect';
import AddressFormInputs from './microComponents/AddressFormInputs';
import { AddressAction } from './microComponents/AddressActionMenu';
import {
  ADDRESS_TYPE,
  getAddressType,
} from '../../../../../utils/addressManagement';

export type FormData = {
  address: string | undefined;
  address2: string | null;
  city: string | undefined;
  zipCode: string | undefined;
  state: string | null;
};

interface Props {
  formType: 'edit' | 'add';
  setIsModalOpen: SetState<boolean>;
  setUserAddresses?: SetState<UpdatedAddress[]>;
  selectedAddressForAction?: UpdatedAddress | null;
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
  formType,
  addressAction,
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
  } = useForm<FormData>({
    mode: 'onBlur',
    defaultValues: defaultAddressDetail,
  });

  const tProfile = useTranslations('Profile');
  const tCommon = useTranslations('Common');
  const { contextLoaded, user, token, logoutUser } = useUserProps();
  const { tenantConfig } = useTenant();
  const { setErrors } = useContext(ErrorHandlingContext);
  const userCountry =
    formType === 'add' ? user?.country : selectedAddressForAction?.country;
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

  const editAddress = async (data: FormData) => {
    if (!addressAction || !selectedAddressForAction) return;
    setIsUploadingData(true);
    const bodyToSend = {
      ...data,
      country,
      type: getAddressType(formType, selectedAddressForAction.type),
    };
    try {
      const res = await putAuthenticatedRequest<UpdatedAddress>(
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

  const addAddress = async (data: FormData) => {
    setIsUploadingData(true);
    const bodyToSend = {
      ...data,
      country,
      type: ADDRESS_TYPE.OTHER,
    };
    if (contextLoaded && user) {
      try {
        const res = await postAuthenticatedRequest<UpdatedAddress>(
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
            text={
              formType === 'add'
                ? tProfile(`addressManagement.formType.${formType}`)
                : tProfile('addressManagement.saveChanges')
            }
            variant="primary"
            elementType="button"
            onClick={handleSubmit(
              formType === 'add' ? addAddress : editAddress
            )}
            buttonClasses={styles.addAddressButton}
          />
        </div>
      )}
    </div>
  );
};

export default AddressForm;
