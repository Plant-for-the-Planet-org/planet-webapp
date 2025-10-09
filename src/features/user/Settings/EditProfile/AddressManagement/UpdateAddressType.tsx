import type { Address } from '@planet-sdk/common';

import { useTranslations } from 'next-intl';
import { CircularProgress } from '@mui/material';
import styles from './AddressManagement.module.scss';
import WebappButton from '../../../../common/WebappButton';
import FormattedAddressBlock from './microComponents/FormattedAddressBlock';
import { useAddressOperations } from './useAddressOperations';

type AddressType = 'primary' | 'mailing';
interface Props {
  addressType: AddressType;
  userAddress: Address | undefined;
  selectedAddressForAction: Address;
  handleCancel: () => void;
}

const UpdateAddressType = ({
  addressType,
  userAddress,
  selectedAddressForAction,
  handleCancel,
}: Props) => {
  const tAddressManagement = useTranslations('EditProfile.addressManagement');
  const tCommon = useTranslations('Common');
  const { updateAddressType, isLoading } = useAddressOperations();

  const handleAddressType = () =>
    updateAddressType(selectedAddressForAction.id, addressType).finally(
      handleCancel
    );

  return (
    <div className={styles.addressActionContainer}>
      <h2 className={styles.header}>
        {tAddressManagement(`addressType.${addressType}`)}
      </h2>
      <p>
        {tAddressManagement('updateAddressType.setAddressConfirmation', {
          addressType: tAddressManagement(`addressType.${addressType}`),
        })}
        {userAddress &&
          tAddressManagement('updateAddressType.replaceAddressWarning', {
            addressType: tAddressManagement(`addressType.${addressType}`),
          })}
      </p>
      {userAddress !== undefined && (
        <div className={styles.address}>
          <FormattedAddressBlock userAddress={userAddress} />
        </div>
      )}
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
            onClick={handleAddressType}
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

export default UpdateAddressType;
