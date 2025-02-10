import type { AddressAction } from '../../common/types/profile';
import type { APIError, Address } from '@planet-sdk/common';

import { useCallback, useContext, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Modal } from '@mui/material';
import { handleError } from '@planet-sdk/common';
import { useRouter } from 'next/router';
import BackButton from '../../../../public/assets/images/icons/BackButton';
import styles from './DonationReceipt.module.scss';
import { useDonationReceipt } from '../../common/Layout/DonationReceiptContext';
import DonorContactForm from './microComponents/DonorContactForm';
import { useUserProps } from '../../common/Layout/UserPropsContext';
import AddAddress from '../Settings/EditProfile/AddressManagement/AddAddress';
import EditAddress from '../Settings/EditProfile/AddressManagement/EditAddress';
import { ADDRESS_ACTIONS } from '../../../utils/addressManagement';
import { getAuthenticatedRequest } from '../../../utils/apiRequests/api';
import { useTenant } from '../../common/Layout/TenantContext';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';

const DonorContactManagement = () => {
  const t = useTranslations('DonationReceipt');
  const router = useRouter();
  const { donationReceiptData, setDonationReceiptData } = useDonationReceipt();
  const { user, token, contextLoaded, logoutUser } = useUserProps();
  const { tenantConfig } = useTenant();
  const { setErrors } = useContext(ErrorHandlingContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addressAction, setAddressAction] = useState<AddressAction | null>(
    null
  );
  const [selectedAddressForAction, setSelectedAddressForAction] =
    useState<Address | null>(null);
  const [donorAddresses, setDonorAddresses] = useState<Address[]>(
    user?.addresses ?? []
  );
  const [isLoading, setIsLoading] = useState(false);

  const navigateToVerificationPage = useCallback(() => {
    if (donationReceiptData) {
      const { dtn, challenge, year } = donationReceiptData;
      router
        .push(
          `/verify-receipt-data?dtn=${dtn}&challenge=${challenge}&year=${year}`
        )
        .then(() => setIsLoading(false));
    }
  }, [donationReceiptData, router]);

  const updateDonorAddresses = useCallback(async () => {
    if (!user || !token || !contextLoaded) return;
    try {
      const res = await getAuthenticatedRequest<Address[]>({
        tenant: tenantConfig.id,
        url: '/app/addresses',
        token,
        logoutUser,
      });
      if (res) setDonorAddresses(res);
    } catch (error) {
      setErrors(handleError(error as APIError));
    }
  }, [user, token, contextLoaded, tenantConfig.id, logoutUser, setErrors]);

  const renderModalContent = useMemo(() => {
    switch (addressAction) {
      case ADDRESS_ACTIONS.EDIT:
        if (!selectedAddressForAction) return <></>;
        return (
          <EditAddress
            selectedAddressForAction={selectedAddressForAction}
            setIsModalOpen={setIsModalOpen}
            setAddressAction={setAddressAction}
            updateUserAddresses={updateDonorAddresses}
            showPrimaryAddressToggle={true}
          />
        );
      case ADDRESS_ACTIONS.ADD:
        return (
          <AddAddress
            setIsModalOpen={setIsModalOpen}
            setAddressAction={setAddressAction}
            updateUserAddresses={updateDonorAddresses}
            showPrimaryAddressToggle={true}
          />
        );
      default:
        return <></>;
    }
  }, [addressAction, selectedAddressForAction, updateDonorAddresses]);

  return (
    <section className={styles.donorReceiptLayout}>
      <div className={styles.donorContactManagement}>
        <div className={styles.headerContainer}>
          <button onClick={navigateToVerificationPage}>
            <BackButton />
          </button>
          <h2 className={styles.contactManagementHeader}>
            {t('contactManagementHeader')}
          </h2>
        </div>
        <DonorContactForm
          donorAddresses={donorAddresses}
          donationReceiptData={donationReceiptData}
          setDonationReceiptData={setDonationReceiptData}
          setSelectedAddressForAction={setSelectedAddressForAction}
          setAddressAction={setAddressAction}
          setIsModalOpen={setIsModalOpen}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          navigateToVerificationPage={navigateToVerificationPage}
        />
      </div>
      <Modal open={isModalOpen} aria-labelledby="address-action-modal-title">
        {renderModalContent}
      </Modal>
    </section>
  );
};

export default DonorContactManagement;
