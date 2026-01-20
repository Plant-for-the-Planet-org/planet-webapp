import type { ExtendedCountryCode } from '../../../../common/types/country';
import type { AddressFormData } from './microComponents/AddressForm';
import type { AddressType, Address, APIError } from '@planet-sdk/common';

import { useContext, useEffect, useRef, useState } from 'react';
import { useApi } from '../../../../../hooks/useApi';
import { ErrorHandlingContext } from '../../../../common/Layout/ErrorHandlingContext';
import { handleError } from '@planet-sdk/common';
import {
  updateAddressesAfterAdd,
  updateAddressesAfterDelete,
  updateAddressesAfterEdit,
  updateAddressesAfterTypeChange,
} from './utils';
import { useAuthStore, useUserStore } from '../../../../../stores';

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
  const { postApiAuthenticated, putApiAuthenticated, deleteApiAuthenticated } =
    useApi();
  const { setErrors } = useContext(ErrorHandlingContext);
  const isMountedRef = useRef(true);
  // local state
  const [isLoading, setIsLoading] = useState(false);
  //store: state
  const isAuthReady = useAuthStore(
    (state) => state.token !== null && state.isAuthResolved
  );

  const userProfile = useUserStore((state) => state.userProfile);
  const setUserProfile = useUserStore((state) => state.setUserProfile);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const safeExecute = async (operation: () => Promise<void>) => {
    if (!isAuthReady || !userProfile) return;
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
      if (addAddressResponse) {
        setUserProfile(
          updateAddressesAfterAdd(userProfile, addAddressResponse)
        );
      }
    });
  };

  const editAddress = async (id: string, payload: EditAddressApiPayload) => {
    await safeExecute(async () => {
      const editAddressResponse = await putApiAuthenticated<
        Address,
        EditAddressApiPayload
      >(`/app/addresses/${id}`, { payload });
      if (editAddressResponse) {
        setUserProfile(
          updateAddressesAfterEdit(userProfile, editAddressResponse)
        );
      }
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
        setUserProfile(
          updateAddressesAfterTypeChange(
            userProfile,
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
        setUserProfile(
          updateAddressesAfterTypeChange(
            userProfile,
            updateAddressResponse,
            'other'
          )
        );
      }
    });
  };

  const deleteAddress = async (id: string) => {
    await safeExecute(async () => {
      await deleteApiAuthenticated(`/app/addresses/${id}`);
      setUserProfile(updateAddressesAfterDelete(userProfile, id));
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
