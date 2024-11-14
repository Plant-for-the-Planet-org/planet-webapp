import type { APIError, CountryCode } from '@planet-sdk/common';
import type {
  AddressAction,
  AddressType,
} from './microComponents/AddressActionMenu';

import { useContext, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Modal } from '@mui/material';
import AddressList from './microComponents/AddressList';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import WebappButton from '../../../../common/WebappButton';
import styles from './AddressManagement.module.scss';
import AddressFormModal from './AddressFormModal';
import { getAuthenticatedRequest } from '../../../../../utils/apiRequests/api';
import { useTenant } from '../../../../common/Layout/TenantContext';
import { ErrorHandlingContext } from '../../../../common/Layout/ErrorHandlingContext';
import { handleError } from '@planet-sdk/common';

export interface UpdatedAddress {
  id: string;
  type: AddressType;
  name: string | null;
  state: string | null;
  isPrimary: boolean | null;
  address2: string | null;
  address: string;
  city?: string;
  zipCode?: string;
  country: CountryCode;
}
export const addressType = ['primary', 'mailing', 'other'];
const AddressManagement = () => {
  const { user, contextLoaded, token, logoutUser } = useUserProps();
  const { tenantConfig } = useTenant();
  const { setErrors } = useContext(ErrorHandlingContext);
  const tProfile = useTranslations('Profile.addressManagement');
  const [userAddresses, setUserAddresses] = useState<UpdatedAddress[]>(
    user?.addresses
  ); // need to update planet-sdk to include addresses key
  const [addressAction, setAddressAction] = useState<AddressAction | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sortedAddresses = useMemo(() => {
    return userAddresses.sort((a, b) => {
      return addressType.indexOf(a.type) - addressType.indexOf(b.type);
    });
  }, [userAddresses]);

  const fetchUserAddresses = async () => {
    if (!user || !token || !contextLoaded) return;
    try {
      const res = await getAuthenticatedRequest<UpdatedAddress[]>(
        tenantConfig.id,
        '/app/addresses',
        token,
        logoutUser
      );
      if (res) setUserAddresses(res);
    } catch (error) {
      setErrors(handleError(error as APIError));
    }
  };

  return (
    <>
      <AddressList
        addresses={sortedAddresses}
        addressAction={addressAction}
        setAddressAction={setAddressAction}
        setUserAddresses={setUserAddresses}
        fetchUserAddresses={fetchUserAddresses}
      />
      <WebappButton
        text={tProfile('addNewAddress')}
        elementType="button"
        onClick={() => setIsModalOpen(true)}
        variant="primary"
        buttonClasses={styles.addNewAddressButton}
      />
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddressFormModal
          formType="add"
          setIsModalOpen={setIsModalOpen}
          setUserAddresses={setUserAddresses}
        />
      </Modal>
    </>
  );
};

export default AddressManagement;
