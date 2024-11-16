import {
  AddressFormType,
  AddressType,
} from '../features/user/Settings/EditProfile/AddressManagment/microComponents/AddressActionMenu';

export const ADDRESS_TYPE = {
  PRIMARY: 'primary',
  MAILING: 'mailing',
  OTHER: 'other',
} as const;

export const ADDRESS_ACTIONS = {
  EDIT: 'edit',
  DELETE: 'delete',
  SET_PRIMARY: 'setPrimary',
  SET_BILLING: 'setBilling',
} as const;

export const ADDRESS_FORM_TYPE = {
  ADD_ADDRESS: 'add',
  EDIT_ADDRESS: 'edit',
} as const;

export const formatAddress = (
  address: string | undefined,
  zipCode: string | undefined,
  city: string | undefined,
  state: string | null,
  country: string
) => {
  const cleanAddress = [address, `${zipCode} ${city}`, state, country]
    .filter(Boolean)
    .join(', ')
    .replace(/\s+/g, ' ')
    .trim();

  return cleanAddress;
};

export const validationPattern = {
  address: /^[\p{L}\p{N}\sß.,#/-]+$/u,
  cityState: /^[\p{L}\sß.,()-]+$/u,
};

export const getAddressType = (
  formType: AddressFormType,
  userAddressType: AddressType
) => {
  if (
    formType === ADDRESS_FORM_TYPE.EDIT_ADDRESS &&
    (userAddressType === ADDRESS_TYPE.MAILING ||
      userAddressType === ADDRESS_TYPE.PRIMARY)
  ) {
    return userAddressType;
  }
  return 'other';
};
