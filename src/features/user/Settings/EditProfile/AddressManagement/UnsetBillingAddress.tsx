import type { Address } from '@planet-sdk/common';

import { useTranslations } from 'next-intl';
import { CircularProgress } from '@mui/material';
import styles from './AddressManagement.module.scss';
import WebappButton from '../../../../common/WebappButton';
import { useAddressOperations } from './useAddressOperations';

interface Props {
  addressType: 'mailing';
  selectedAddressForAction: Address;
  handleCancel: () => void;
}

const UnsetBillingAddress = ({
  addressType,
  selectedAddressForAction,
  handleCancel,
}: Props) => {
  const tAddressManagement = useTranslations('EditProfile.addressManagement');
  const tCommon = useTranslations('Common');
  const { unsetBillingAddress, isLoading } = useAddressOperations();

  const handleBillingAddress = () =>
    unsetBillingAddress(selectedAddressForAction.id).finally(handleCancel);

  return (
    <div className={styles.addressActionContainer}>
      <h2 className={styles.header}>
        {tAddressManagement(`addressType.${addressType}`)}
      </h2>
      <p>
        {tAddressManagement('updateAddressType.unsetBillingAddressMessage')}
      </p>
      {!isLoading ? (
        <div className={styles.buttonContainer}>
          <WebappButton
            text={tCommon('cancel')}
            elementType="button"
            variant="secondary"
            onClick={handleCancel}
          />
          <WebappButton
            text={tAddressManagement('updateAddressType.confirmButton')}
            elementType="button"
            variant="primary"
            onClick={handleBillingAddress}
          />
        </div>
      ) : (
        <div className={styles.loadingSpinner}>
          <CircularProgress color="success" />
        </div>
      )}
    </div>
  );
};

export default UnsetBillingAddress;
