import type { Address } from '@planet-sdk/common';
import type { AddressAction } from './microComponents/AddressActionMenu';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import AddressList from './microComponents/AddressList';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import WebappButton from '../../../../common/WebappButton';
import styles from './AddressManagement.module.scss';

export type AddressType = 'primary' | 'mailing' | 'other';

export interface UpdatedAddress extends Address {
  id: string;
  type: AddressType;
  name: string | null;
  state: string | null;
  isPrimary: boolean | null;
  address2: string | null;
}
export const addressType = ['primary', 'mailing', 'other'];
const AddressManagement = () => {
  const { user } = useUserProps();
  const tMe = useTranslations('Me');
  const [userAddresses, setUserAddresses] = useState<UpdatedAddress[]>(
    user?.addresses
  ); // need to update planet-sdk to include addresses key
  const [addressAction, setAddressAction] = useState<AddressAction | null>(
    null
  );
  const openAddressForm = () => {};
  const sortedAddresses = useMemo(() => {
    return userAddresses.sort((a, b) => {
      return addressType.indexOf(a.type) - addressType.indexOf(b.type);
    });
  }, [userAddresses]);

  return (
    <>
      <AddressList
        addresses={sortedAddresses}
        setAddressAction={setAddressAction}
      />
      <WebappButton
        text={tMe('addressManagement.addNewAddress')}
        elementType="button"
        onClick={openAddressForm}
        variant="primary"
        buttonClasses={styles.addNewAddressButton}
      />
    </>
  );
};

export default AddressManagement;
