import type {
  AddressActionItem,
  AddressType,
} from './microComponents/AddressActions';

import { ADDRESS_ACTIONS } from './microComponents/AddressActions';

export const filterAddressActions = (
  actions: AddressActionItem[],
  type: AddressType
) => {
  return actions.filter((item) => {
    if (type === 'primary' && item.action === ADDRESS_ACTIONS.SET_PRIMARY)
      return false;
    if (type === 'mailing' && item.action === ADDRESS_ACTIONS.SET_BILLING)
      return false;
    return true;
  });
};
