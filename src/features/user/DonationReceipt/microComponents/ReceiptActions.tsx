import { RECEIPT_STATUS } from '../utils';
import type { APIError } from '@planet-sdk/common';
import type { ReceiptDataAPI } from '../../../common/Layout/DonationReceiptContext';

import { useContext } from 'react';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import { handleError } from '@planet-sdk/common';
import EditIcon from '../../../../../public/assets/images/icons/EditIcon';
import WebappButton from '../../../common/WebappButton';
import styles from '../donationReceipt.module.scss';
import DownloadIcon from '../../../../../public/assets/images/icons/projectV2/DownloadIcon';
import { putRequest } from '../../../../utils/apiRequests/api';
import { useTenant } from '../../../common/Layout/TenantContext';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';

type Props = {
  downloadUrl: string | null;
  operation: (typeof RECEIPT_STATUS)[keyof typeof RECEIPT_STATUS];
  hasDonorDataChanged: boolean;
  dtn: string;
  challenge: string;
  year: string;
  updateDonationReceiptData: (data: Partial<ReceiptDataAPI>) => void;
};

const ReceiptActions = ({
  downloadUrl,
  operation,
  hasDonorDataChanged,
  dtn,
  challenge,
  year,
  updateDonationReceiptData,
}: Props) => {
  const t = useTranslations('Donate.donationReceipt');
  const router = useRouter();
  const { tenantConfig } = useTenant();
  const { setErrors } = useContext(ErrorHandlingContext);

  const confirmRecipientData = async () => {
    if (operation !== RECEIPT_STATUS.VERIFY) return;
    const verificationDate = new Date().toISOString();

    if (hasDonorDataChanged) {
      //TODO: PUT Authentication request logic
    }

    try {
      const data = await putRequest({
        tenant: tenantConfig.id,
        url: `/app/donationReceipt/verify`,
        data: {
          dtn,
          challenge,
          year,
          verificationDate,
        },
      });
      if (data) updateDonationReceiptData(data);
    } catch (error) {
      setErrors(handleError(error as APIError));
    }
  };
  const showDowloadButton =
    operation === RECEIPT_STATUS.DOWNLOAD && downloadUrl !== null;
  return (
    <div className={styles.receiptActions}>
      {showDowloadButton ? (
        <WebappButton
          variant="primary"
          text={t('download')}
          elementType="link"
          icon={<DownloadIcon color="#fff" />}
          href={downloadUrl}
          target={'_blank'}
        />
      ) : (
        <>
          <WebappButton
            variant="secondary"
            text={t('modifyContactInformation')}
            elementType="button"
            icon={<EditIcon />}
            onClick={() =>
              router.push(`/profile/tax-receipt/modify-recipient-data`)
            }
          />
          <WebappButton
            variant="primary"
            text={t('confirm')}
            elementType="button"
            onClick={confirmRecipientData}
          />
        </>
      )}
    </div>
  );
};

export default ReceiptActions;
