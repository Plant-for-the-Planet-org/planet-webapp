import type { AddressAction } from '../../common/types/profile';
import type { APIError, Address } from '@planet-sdk/common';
import type { ReceiptDataAPI } from './donationReceiptTypes';

import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Modal } from '@mui/material';
import { handleError } from '@planet-sdk/common';
import { useRouter } from 'next/router';
import BackButton from '../../../../public/assets/images/icons/BackButton';
import styles from './DonationReceipt.module.scss';
import { useDonationReceipt } from '../../common/Layout/DonationReceiptContext';
import DonorContactForm from './microComponents/DonorContactForm';
import AddAddress from '../Settings/EditProfile/AddressManagement/AddAddress';
import EditAddress from '../Settings/EditProfile/AddressManagement/EditAddress';
import { ADDRESS_ACTIONS } from '../../../utils/addressManagement';
import { getRequest } from '../../../utils/apiRequests/api';
import { useTenant } from '../../common/Layout/TenantContext';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import EditPermissionDenied from './microComponents/EditPermissionDenied';
import { useUserProps } from '../../common/Layout/UserPropsContext';

type StoredReceiptData = {
  dtn: string;
  year: string;
  challenge: string;
  donorEmail: string;
};

const DonorContactManagement = () => {
  const t = useTranslations('DonationReceipt');
  const { donationReceiptData, updateDonationReceiptData } =
    useDonationReceipt();
  const { user } = useUserProps();

  const receiptDataString = sessionStorage.getItem('receiptData');
  const parsedData: StoredReceiptData = receiptDataString
    ? JSON.parse(receiptDataString)
    : null;
  const isEligibleForEdit =
    user?.email ===
    (parsedData?.donorEmail || donationReceiptData?.donor.email);
  if (!isEligibleForEdit) return <EditPermissionDenied />;

  const router = useRouter();
  const { tenantConfig } = useTenant();
  const { setErrors } = useContext(ErrorHandlingContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addressAction, setAddressAction] = useState<AddressAction | null>(
    null
  );
  const [selectedAddressForAction, setSelectedAddressForAction] =
    useState<Address | null>(null);

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

  useEffect(() => {
    if (donationReceiptData) return;

    if (!parsedData) {
      router.push('/');
      return;
    }
    const { dtn, year, challenge } = parsedData;
    const fetchReceiptData = async () => {
      try {
        const data = await getRequest<ReceiptDataAPI>({
          tenant: tenantConfig.id,
          url: '/app/donationReceipt',
          queryParams: {
            dtn,
            year,
            challenge,
          },
        });
        if (data) updateDonationReceiptData(data);
      } catch (err) {
        setErrors(handleError(err as APIError));
        router.push('/');
      }
    };

    fetchReceiptData();
  }, [
    tenantConfig.id,
    updateDonationReceiptData,
    handleError,
    donationReceiptData,
    router,
  ]);

  const renderModalContent = useMemo(() => {
    switch (addressAction) {
      case ADDRESS_ACTIONS.EDIT:
        if (!selectedAddressForAction) return <></>;
        return (
          <EditAddress
            selectedAddressForAction={selectedAddressForAction}
            setIsModalOpen={setIsModalOpen}
            setAddressAction={setAddressAction}
            showPrimaryAddressToggle={true}
          />
        );
      case ADDRESS_ACTIONS.ADD:
        return (
          <AddAddress
            setIsModalOpen={setIsModalOpen}
            setAddressAction={setAddressAction}
            showPrimaryAddressToggle={true}
          />
        );
      default:
        return <></>;
    }
  }, [addressAction, selectedAddressForAction]);

  return (
    <section className={styles.donorContactManagementLayout}>
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
          donationReceiptData={donationReceiptData}
          updateDonationReceiptData={updateDonationReceiptData}
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
