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
} as const;

export const addressTypeOrder = ['primary', 'mailing', 'other'];

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
