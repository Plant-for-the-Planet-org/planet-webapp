import type { ExtendedCountryCode } from '../../../../common/types/country';
import type { AddressFormData } from './microComponents/AddressForm';
import type { AddressType, Address, APIError } from '@planet-sdk/common';

import { useContext, useState } from 'react';
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

  const safeExecute = async (operation: () => Promise<void>) => {
    if (!contextLoaded || !user || !token) return;
    setIsLoading(true);
    try {
      await operation();
    } catch (error) {
      setErrors(handleError(error as APIError));
    } finally {
      setIsLoading(false);
    }
  };

  const addAddress = async (payload: AddAddressApiPayload) => {
    await safeExecute(async () => {
      const res = await postApiAuthenticated<Address, AddAddressApiPayload>(
        '/app/addresses',
        { payload }
      );
      if (res) setUser((prev) => updateAddressesAfterAdd(prev, res));
    });
  };

  const editAddress = async (id: string, payload: EditAddressApiPayload) => {
    await safeExecute(async () => {
      const res = await putApiAuthenticated<Address, EditAddressApiPayload>(
        `/app/addresses/${id}`,
        { payload }
      );
      if (res) setUser((prev) => updateAddressesAfterEdit(prev, res));
    });
  };

  const updateAddressType = async (id: string, addressType: AddressType) => {
    await safeExecute(async () => {
      const payload: AddressTypeApiPayload = { type: addressType };
      const res = await putApiAuthenticated<Address, AddressTypeApiPayload>(
        `/app/addresses/${id}`,
        { payload }
      );
      if (res)
        setUser((prev) =>
          updateAddressesAfterTypeChange(prev, res, addressType)
        );
    });
  };

  const unsetBillingAddress = async (id: string) => {
    await safeExecute(async () => {
      const payload: UnsetBillingAddressApiPayload = { type: 'other' };
      const res = await putApiAuthenticated<
        Address,
        UnsetBillingAddressApiPayload
      >(`/app/addresses/${id}`, { payload });
      if (res) {
        setUser((prev) =>
          prev
            ? {
                ...prev,
                addresses: prev.addresses.map((addr) =>
                  addr.id === id ? { ...addr, type: 'other' } : addr
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
      setUser((prev) =>
        prev
          ? {
              ...prev,
              addresses: prev.addresses.filter((addr) => addr.id !== id),
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
