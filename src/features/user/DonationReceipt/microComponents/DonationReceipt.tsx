import type {Operation, ReceiptData} from '../donationReceiptTypes';
import VerifyReceiptHeader from './VerifyReceiptHeader';
import ReceiptDataSection from './ReceiptDataSection';
import VerifyReceiptFooter from './VerifyReceiptFooter';
import styles from '../DonationReceipt.module.scss';

interface DonationReceiptProps {
    donationReceipt: ReceiptData;
    isLoading: boolean;
    operation: Operation;
    confirmReceiptData: () => Promise<void>;
}

const DonationReceipt = ({
                             donationReceipt,
                             isLoading,
                             operation,
                             confirmReceiptData,
                         }: DonationReceiptProps) => {
    return (
        <div className={styles.donationReceiptLayout}>
            <div className={styles.donationReceiptContainer}>
                <VerifyReceiptHeader operation={operation}/>
                <ReceiptDataSection
                    donationReceipt={donationReceipt}
                    isLoading={isLoading}
                    confirmReceiptData={confirmReceiptData}
                />
                <VerifyReceiptFooter/>
            </div>
        </div>
    );
};

export default DonationReceipt;