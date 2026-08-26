import { useEffect } from 'react';
import { useDonationReceiptStore } from '../stores/donationReceiptStore';

export const useInitializeDonationReceipt = () => {
  // store: action
  const initializeFromSession = useDonationReceiptStore(
    (state) => state.initializeFromSession
  );

  useEffect(() => {
    initializeFromSession();
  }, [initializeFromSession]);
};
