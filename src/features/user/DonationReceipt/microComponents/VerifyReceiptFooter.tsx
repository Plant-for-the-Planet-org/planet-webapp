// import RedirectRightArrowIcon from '../../../../../public/assets/images/icons/RedirectRightArrowIcon';
import styles from '../DonationReceipt.module.scss';
// import { useTranslations } from 'next-intl';
import SupportAssistanceInfo from './SupportAssistanceInfo';

const VerifyReceiptFooter = () => {
  // const tReceipt = useTranslations('DonationReceipt');

  return (
    <section className={styles.verifyReceiptFooter}>
      {/* <div className={styles.viewTaxReceiptsAction}>
        <div>
          <h3>{tReceipt('viewAllTaxReceipts')}</h3>
          <p>{tReceipt('donationReceiptsManagementInfo')}</p>
        </div>
        <a
          href="/profile/donation-receipt"
          target={'_blank'}
          className={styles.redirectButton}
        >
          <RedirectRightArrowIcon />
        </a>
      </div> */}
      <SupportAssistanceInfo />
    </section>
  );
};

export default VerifyReceiptFooter;
