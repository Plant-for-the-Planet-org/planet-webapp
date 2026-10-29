import { useEffect } from 'react';
import { useDonationReceiptStore } from '../stores/donationReceiptStore';

export const useInitializeDonationReceipt = () => {
  useEffect(() => {
    useDonationReceiptStore.persist.rehydrate();
  }, []);
};
