import type { AddressAction } from '../../common/types/profile';
import type { Address } from '@planet-sdk/common';

import { useTranslations } from 'next-intl';
import { Modal } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import BackButton from '../../../../public/assets/images/icons/BackButton';
import styles from './donationReceipt.module.scss';
import { useDonorReceipt } from '../../common/Layout/DonorReceiptContext';
import DonorContactForm from './microComponents/DonorContactForm';
import { useUserProps } from '../../common/Layout/UserPropsContext';
import AddAddress from '../Settings/EditProfile/AddressManagement/AddAddress';
import EditAddress from '../Settings/EditProfile/AddressManagement/EditAddress';
import { ADDRESS_ACTIONS } from '../../../utils/addressManagement';

const DonorContactManagement = () => {
  const t = useTranslations('Donate.donationReceipt');
  const router = useRouter();
  const { donorReceiptData } = useDonorReceipt();
  const { user } = useUserProps();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addressAction, setAddressAction] = useState<AddressAction | null>(
    null
  );
  const [selectedAddressForAction, setSelectedAddressForAction] =
    useState<Address | null>(null);

  const navigateToVerificationPage = useCallback(() => {
    if (donorReceiptData) {
      const { dtn, challenge, year } = donorReceiptData;
      router.push(
        `/verify-receipt-data?dtn=${dtn}&challenge=${challenge}&year=${year}`
      );
    }
  }, [donorReceiptData, router]);

  const renderModalContent = useMemo(() => {
    if (!selectedAddressForAction) return <></>;
    switch (addressAction) {
      case ADDRESS_ACTIONS.EDIT:
        return (
          <EditAddress
            selectedAddressForAction={selectedAddressForAction}
            setIsModalOpen={setIsModalOpen}
            setAddressAction={setAddressAction}
          />
        );
      case ADDRESS_ACTIONS.ADD:
        return (
          <AddAddress
            setIsModalOpen={setIsModalOpen}
            setAddressAction={setAddressAction}
          />
        );
      default:
        return <></>;
    }
  }, [addressAction, selectedAddressForAction]);

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
          donorReceiptData={donorReceiptData}
          user={user}
          setSelectedAddressForAction={setSelectedAddressForAction}
          setAddressAction={setAddressAction}
          setIsModalOpen={setIsModalOpen}
        />
      </div>
      <Modal open={isModalOpen} aria-labelledby="address-action-modal-title">
        {renderModalContent}
      </Modal>
    </section>
  );
};

export default DonorContactManagement;
