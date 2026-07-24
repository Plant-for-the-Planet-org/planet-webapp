import type { Address, CountryCode } from '@planet-sdk/common';
import type { SetState } from '../../../common/types/common';
import type { AddressAction } from '../../../common/types/profile';
import type { FormValues } from './DonorContactForm';
import type { UseFormSetValue } from 'react-hook-form';

import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  ADDRESS_ACTIONS,
  ADDRESS_TYPE,
  getFormattedAddress,
} from '../../../../utils/addressManagement';
import StyledRadio from './StyledRadio';
import styles from '../DonationReceipt.module.scss';
import EditIcon from '../../../../../public/assets/images/icons/EditIcon';
import DonorAddressCheckIcon from '../../../../../public/assets/images/icons/DonorAddressCheckIcon';

type Props = {
  address: Address;
  setSelectedAddress: SetState<Address | null>;
  setAddressAction: SetState<AddressAction | null>;
  setIsModalOpen: SetState<boolean>;
  checkedAddressGuid: string | null;
  setCheckedAddressGuid: SetState<string | null>;
  setValue: UseFormSetValue<FormValues>;
};

const DonorAddressList = ({
  address,
  setSelectedAddress,
  setAddressAction,
  setIsModalOpen,
  checkedAddressGuid,
  setCheckedAddressGuid,
  setValue,
}: Props) => {
  const tCountry = useTranslations('Country');
  const tAddressManagement = useTranslations('EditProfile.addressManagement');
  const { zipCode, city, country } = address;

  const formattedAddress = useMemo(
    () =>
      getFormattedAddress(
        address.zipCode,
        address.city,
        null,
        tCountry(address.country.toLowerCase() as Lowercase<CountryCode>)
      ),
    [zipCode, city, country]
  );

  // Auto-select primary address if none is selected
  useEffect(() => {
    if (!checkedAddressGuid && address.isPrimary) {
      setCheckedAddressGuid(address.id);
      setValue('addressGuid', address.id, { shouldValidate: true });
    }
  }, [address, checkedAddressGuid, setCheckedAddressGuid, setValue]);

  return (
    <section className={styles.addressInfoContainer}>
      <div className={styles.addressInfoSubContainer}>
        <StyledRadio
          value={address.id}
          icon={<CheckBoxOutlineBlankIcon />}
          checkedIcon={<DonorAddressCheckIcon />}
          inputProps={{
            'aria-label': `${address.address}${
              address.address2 ? `, ${address.address2}` : ''
            }, ${formattedAddress}`,
          }}
        />

        <div>
          <address>
            {address.address}, {formattedAddress}
          </address>
          {address.address2 && (
            <address>
              {address.address2}, {formattedAddress}
            </address>
          )}
        </div>
      </div>

      {address.type === ADDRESS_TYPE.PRIMARY && (
        <span className={styles.addressType}>
          {tAddressManagement(`addressType.${address.type}`)}
        </span>
      )}

      <button
        onClick={(e) => {
          e.preventDefault();
          setSelectedAddress(address);
          setAddressAction(ADDRESS_ACTIONS.EDIT);
          setIsModalOpen(true);
        }}
        type="button"
        aria-label={tAddressManagement('addressForm.editAddress')}
      >
        <span aria-hidden="true" style={{ display: 'contents' }}>
          <EditIcon />
        </span>
      </button>
    </section>
  );
};

export default DonorAddressList;
