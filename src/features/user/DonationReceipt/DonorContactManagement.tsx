import type { AddressAction } from '../../common/types/profile';
import type { APIError, Address, User } from '@planet-sdk/common';
import type { FormValues } from './microComponents/DonorContactForm';

import { useCallback, useContext, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Modal } from '@mui/material';
import { handleError } from '@planet-sdk/common';
import { useRouter } from 'next/router';
import BackButton from '../../../../public/assets/images/icons/BackButton';
import styles from './DonationReceipt.module.scss';
import { useUserProps } from '../../common/Layout/UserPropsContext';
import AddAddress from '../Settings/EditProfile/AddressManagement/AddAddress';
import EditAddress from '../Settings/EditProfile/AddressManagement/EditAddress';
import { ADDRESS_ACTIONS } from '../../../utils/addressManagement';
import { useServerApi } from '../../../hooks/useServerApi';
import { useDonationReceiptContext } from '../../common/Layout/DonationReceiptContext';
import DonorContactForm from './microComponents/DonorContactForm';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import DebugPanel from './DebugPanel';
import { transformProfileToDonorView } from './transformers'; // TODO: remove for production
import { validateOwnership } from './DonationReceiptValidator';
import EditPermissionDenied from './microComponents/EditPermissionDenied';

const DonorContactManagement = () => {
  const { getDebugState, updateDonorAndAddress, email } =
    useDonationReceiptContext();
  const t = useTranslations('DonationReceipt');
  const router = useRouter();
  const { user, contextLoaded, setUser } = useUserProps();
  const isOwner = validateOwnership(email, user);
  if (!isOwner) return <EditPermissionDenied />;

  const { setErrors } = useContext(ErrorHandlingContext);
  const { getApiAuthenticated, putApiAuthenticated } = useServerApi();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addressAction, setAddressAction] = useState<AddressAction | null>(
    null
  );
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [donorAddresses, setDonorAddresses] = useState<Address[]>(
    user?.addresses ?? []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [checkedAddressGuid, setCheckedAddressGuid] = useState<string | null>(
    null
  );

  // Navigate back to the verification page
  const navigateToVerificationPage = useCallback(() => {
    router
      .push('/profile/donation-receipt/verify')
      .then(() => setIsLoading(false));
  }, [router]);

  // Fetch user addresses
  const updateDonorAddresses = useCallback(async () => {
    if (!user || !contextLoaded) return;

    try {
      const addresses = await getApiAuthenticated<Address[]>('/app/addresses');
      if (addresses) setDonorAddresses(addresses);
    } catch (error) {
      setErrors(handleError(error as APIError));
    }
  }, [user, contextLoaded, getApiAuthenticated, setErrors]);

  // Handle form submission and update user info
  const handleUpdateDonorInfo = async (formData: FormValues) => {
    setIsLoading(true);
    if (!user || !checkedAddressGuid) {
      setErrors([{ message: 'User or address data missing.' }]);
      setIsLoading(false);
      return;
    }

    try {
      let updatedUser = user;

      // Update user profile if changed
      if (
        formData.firstName !== user.firstname ||
        formData.lastName !== user.lastname ||
        formData.tin !== user.tin ||
        formData.companyName !== user.name
      ) {
        const profileData =
          user.type === 'individual'
            ? {
                firstname: formData.firstName,
                lastname: formData.lastName,
                tin: formData.tin,
              }
            : { name: formData.companyName, tin: formData.tin };

        updatedUser = await putApiAuthenticated<User>(
          '/app/profile',
          profileData
        );

        if (!updatedUser) throw new Error('Failed to update user profile.');
        setUser(updatedUser);
      }

      // Update donor addresses
      updateDonorAddresses();

      const donorView = transformProfileToDonorView(updatedUser);
      const selectedAddress = donorAddresses.find(
        (address) => address.id === checkedAddressGuid
      );
      const addressView = {
        address1: selectedAddress?.address ?? '',
        address2: selectedAddress?.address2 ?? '',
        city: selectedAddress?.city ?? '',
        zipCode: selectedAddress?.zipCode ?? '',
        country: selectedAddress?.country ?? '',
      };

      updateDonorAndAddress(donorView, addressView, checkedAddressGuid);
      navigateToVerificationPage();
    } catch (error) {
      setErrors(handleError(error as APIError));
    }
  };

  // Render modal content based on the current address action
  const renderModalContent = () => {
    if (!addressAction) return null;

    const commonProps = {
      setIsModalOpen,
      setAddressAction,
      updateUserAddresses: updateDonorAddresses,
      showPrimaryAddressToggle: true,
    };

    switch (addressAction) {
      case ADDRESS_ACTIONS.EDIT:
        return selectedAddress ? (
          <EditAddress
            selectedAddressForAction={selectedAddress}
            {...commonProps}
          />
        ) : null;

      case ADDRESS_ACTIONS.ADD:
        return <AddAddress {...commonProps} />;

      default:
        return null;
    }
  };

  return (
    <section className={styles.donorContactManagementLayout}>
      <div className={styles.donorContactManagement}>
        <header className={styles.headerContainer}>
          <button onClick={navigateToVerificationPage}>
            <BackButton />
          </button>
          <h2 className={styles.contactManagementHeader}>
            {t('contactManagementHeader')}
          </h2>
        </header>

        <DonorContactForm
          user={user}
          donorAddresses={donorAddresses}
          onSubmit={handleUpdateDonorInfo}
          setSelectedAddress={setSelectedAddress}
          setAddressAction={setAddressAction}
          setIsModalOpen={setIsModalOpen}
          isLoading={isLoading}
          checkedAddressGuid={checkedAddressGuid}
          setCheckedAddressGuid={setCheckedAddressGuid}
        />

        <DebugPanel data={getDebugState()} />
      </div>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="address-action-modal-title"
      >
        {renderModalContent() || <div />}
      </Modal>
    </section>
  );
};

export default DonorContactManagement;
