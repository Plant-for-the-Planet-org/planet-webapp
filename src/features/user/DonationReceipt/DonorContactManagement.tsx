import type { AddressAction } from '../../common/types/profile';
import type { APIError, Address, User } from '@planet-sdk/common';
import type { FormValues } from './microComponents/DonorContactForm';

import { useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Modal } from '@mui/material';
import { handleError } from '@planet-sdk/common';
import { useRouter } from 'next/router';
import BackButton from '../../../../public/assets/images/icons/BackButton';
import styles from './DonationReceipt.module.scss';
import AddAddress from '../Settings/EditProfile/AddressManagement/AddAddress';
import EditAddress from '../Settings/EditProfile/AddressManagement/EditAddress';
import { ADDRESS_ACTIONS } from '../../../utils/addressManagement';
import { useApi } from '../../../hooks/useApi';
import { useDonationReceiptContext } from '../../common/Layout/DonationReceiptContext';
import DonorContactForm from './microComponents/DonorContactForm';
import { transformProfileToDonorView } from './transformers'; // TODO: remove for production
import { validateOwnership } from './DonationReceiptValidator';
import EditPermissionDenied from './microComponents/EditPermissionDenied';
import { RECEIPT_STATUS } from './donationReceiptTypes';
import { useUserStore, useErrorHandlingStore } from '../../../stores';

type IndividualProfile = {
  firstname: string;
  lastname: string;
  tin: string;
};

type CompanyProfile = {
  name: string;
  tin: string;
};

type ProfileData = IndividualProfile | CompanyProfile;

const DonorContactManagement = () => {
  const { updateDonorAndAddress, email, tinIsRequired, getOperation } =
    useDonationReceiptContext();
  const t = useTranslations('DonationReceipt');
  const router = useRouter();
  const { putApiAuthenticated } = useApi();
  // local state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addressAction, setAddressAction] = useState<AddressAction | null>(
    null
  );
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [checkedAddressGuid, setCheckedAddressGuid] = useState<string | null>(
    null
  );
  // store: state
  const userProfile = useUserStore((state) => state.userProfile);
  // store: action
  const setUserProfile = useUserStore((state) => state.setUserProfile);
  const setErrors = useErrorHandlingStore((state) => state.setErrors);

  const isOwner = validateOwnership(email, userProfile?.email);
  if (!isOwner && getOperation() !== RECEIPT_STATUS.ISSUE)
    return <EditPermissionDenied />;

  // Navigate back to the verification page
  const navigateToVerificationPage = useCallback(() => {
    router
      .push('/profile/donation-receipt/verify')
      .then(() => setIsLoading(false));
  }, [router]);

  // Handle form submission and update user info
  const handleUpdateDonorInfo = async (formData: FormValues) => {
    setIsLoading(true);
    if (!userProfile || !checkedAddressGuid) {
      setErrors([{ message: 'User or address data missing.' }]);
      setIsLoading(false);
      return;
    }

    try {
      let updatedUser = userProfile;

      // Update user profile if changed
      if (
        formData.firstName !== userProfile.firstname ||
        formData.lastName !== userProfile.lastname ||
        formData.tin !== userProfile.tin ||
        formData.companyName !== userProfile.name
      ) {
        const profileData: ProfileData =
          userProfile.type === 'individual'
            ? {
                firstname: formData.firstName,
                lastname: formData.lastName,
                tin: formData.tin,
              }
            : { name: formData.companyName, tin: formData.tin };

        updatedUser = await putApiAuthenticated<User, ProfileData>(
          '/app/profile',
          {
            payload: profileData,
          }
        );

        if (!updatedUser) throw new Error('Failed to update user profile.');
        setUserProfile(updatedUser);
      }

      const donorView = transformProfileToDonorView(updatedUser);
      const selectedAddress = userProfile.addresses.find(
        (address) => address.id === checkedAddressGuid
      );
      const addressView = {
        address1: selectedAddress?.address ?? '',
        address2: selectedAddress?.address2 ?? '',
        city: selectedAddress?.city ?? '',
        zipCode: selectedAddress?.zipCode ?? '',
        country: selectedAddress?.country ?? '',
      };

      updateDonorAndAddress(
        donorView,
        addressView,
        checkedAddressGuid,
        updatedUser
      );
      navigateToVerificationPage();
    } catch (error) {
      setErrors(handleError(error as APIError));
    }
  };

  // Render modal content based on the current address action
  const renderModalContent = () => {
    if (!addressAction) return null;

    const commonProps = {
      handleCancel: () => {
        setIsModalOpen(false);
        setAddressAction(null);
      },
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
          <button onClick={navigateToVerificationPage} type="button">
            <BackButton />
          </button>
          <h2 className={styles.contactManagementHeader}>
            {t('contactManagementHeader')}
          </h2>
        </header>

        <DonorContactForm
          user={userProfile}
          onSubmit={handleUpdateDonorInfo}
          setSelectedAddress={setSelectedAddress}
          setAddressAction={setAddressAction}
          setIsModalOpen={setIsModalOpen}
          isLoading={isLoading}
          checkedAddressGuid={checkedAddressGuid}
          setCheckedAddressGuid={setCheckedAddressGuid}
          tinIsRequired={tinIsRequired}
        />
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
