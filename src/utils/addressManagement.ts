import type { Address } from '@planet-sdk/common';

export const ADDRESS_TYPE = {
  PRIMARY: 'primary',
  MAILING: 'mailing',
  OTHER: 'other',
} as const;

export const ADDRESS_ACTIONS = {
  ADD: 'add',
  EDIT: 'edit',
  DELETE: 'delete',
  SET_PRIMARY: 'setPrimary',
  SET_BILLING: 'setBilling',
  UNSET_BILLING: 'unsetBilling',
} as const;

export const ADDRESS_FORM_TYPE = {
  ADD_ADDRESS: 'add',
  EDIT_ADDRESS: 'edit',
} as const;
export const addressTypeOrder = ['primary', 'mailing', 'other'];

export const MAX_ADDRESS_LIMIT = 5;

export const getFormattedAddress = (
  zipCode: string | null,
  city: string | null,
  state: string | null,
  countryName: string
) => {
  return [zipCode, city, state, countryName]
    .filter(Boolean)
    .join(', ')
    .replace(/\s+/g, ' ')
    .trim();
};

export const validationPattern = {
  address: /^[\p{L}\p{N}\sß.,#/-]+$/u,
  cityState: /^[\p{L}\sß.,()-]+$/u,
};

export const findAddressByType = (
  addresses: Address[],
  addressType: 'primary' | 'mailing'
) => {
  return addresses.find((address) => address.type === addressType);
};
