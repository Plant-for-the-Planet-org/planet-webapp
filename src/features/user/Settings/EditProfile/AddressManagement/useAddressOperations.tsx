import type { ExtendedCountryCode } from '../../../../common/types/country';
import type { AddressFormData } from './microComponents/AddressForm';
import type { AddressType, Address, APIError } from '@planet-sdk/common';

import { useContext, useEffect, useRef, useState } from 'react';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import { useApi } from '../../../../../hooks/useApi';
import { ErrorHandlingContext } from '../../../../common/Layout/ErrorHandlingContext';
import { handleError } from '@planet-sdk/common';
import {
  updateAddressesAfterAdd,
  updateAddressesAfterEdit,
  updateAddressesAfterTypeChange,
} from './utils';

export type UnsetBillingAddressApiPayload = {
  type: 'other';
};

export type EditAddressApiPayload = AddressFormData & {
  country: ExtendedCountryCode | string;
  type: AddressType;
};

export type AddAddressApiPayload = AddressFormData & {
  country: ExtendedCountryCode | string;
  type: 'other' | 'primary';
};

type AddressTypeApiPayload = {
  type: AddressType;
};

export const useAddressOperations = () => {
  const { contextLoaded, user, token, setUser } = useUserProps();
  const { postApiAuthenticated, putApiAuthenticated, deleteApiAuthenticated } =
    useApi();
  const { setErrors } = useContext(ErrorHandlingContext);
  const [isLoading, setIsLoading] = useState(false);

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const safeExecute = async (operation: () => Promise<void>) => {
    if (!contextLoaded || !user || !token) return;
    setIsLoading(true);
    try {
      await operation();
    } catch (error) {
      if (isMountedRef.current) {
        setErrors(handleError(error as APIError));
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  const addAddress = async (payload: AddAddressApiPayload) => {
    await safeExecute(async () => {
      const addAddressResponse = await postApiAuthenticated<
        Address,
        AddAddressApiPayload
      >('/app/addresses', { payload });
      if (addAddressResponse)
        setUser((existingUserDetails) =>
          updateAddressesAfterAdd(existingUserDetails, addAddressResponse)
        );
    });
  };

  const editAddress = async (id: string, payload: EditAddressApiPayload) => {
    await safeExecute(async () => {
      const editAddressResponse = await putApiAuthenticated<
        Address,
        EditAddressApiPayload
      >(`/app/addresses/${id}`, { payload });
      if (editAddressResponse)
        setUser((existingUserDetails) =>
          updateAddressesAfterEdit(existingUserDetails, editAddressResponse)
        );
    });
  };

  const updateAddressType = async (id: string, addressType: AddressType) => {
    await safeExecute(async () => {
      const payload: AddressTypeApiPayload = { type: addressType };
      const updateAddressResponse = await putApiAuthenticated<
        Address,
        AddressTypeApiPayload
      >(`/app/addresses/${id}`, { payload });
      if (updateAddressResponse)
        setUser((existingUserDetails) =>
          updateAddressesAfterTypeChange(
            existingUserDetails,
            updateAddressResponse,
            addressType
          )
        );
    });
  };

  const unsetBillingAddress = async (id: string) => {
    await safeExecute(async () => {
      const payload: UnsetBillingAddressApiPayload = { type: 'other' };
      const updateAddressResponse = await putApiAuthenticated<
        Address,
        UnsetBillingAddressApiPayload
      >(`/app/addresses/${id}`, { payload });
      if (updateAddressResponse) {
        setUser((existingUserDetails) =>
          existingUserDetails
            ? {
                ...existingUserDetails,
                addresses: existingUserDetails.addresses.map((address) =>
                  address.id === id ? { ...address, type: 'other' } : address
                ),
              }
            : null
        );
      }
    });
  };

  const deleteAddress = async (id: string) => {
    await safeExecute(async () => {
      await deleteApiAuthenticated(`/app/addresses/${id}`);
      setUser((existingUserDetails) =>
        existingUserDetails
          ? {
              ...existingUserDetails,
              addresses: existingUserDetails.addresses.filter(
                (address) => address.id !== id
              ),
            }
          : null
      );
    });
  };

  return {
    isLoading,
    addAddress,
    editAddress,
    deleteAddress,
    updateAddressType,
    unsetBillingAddress,
  };
};
