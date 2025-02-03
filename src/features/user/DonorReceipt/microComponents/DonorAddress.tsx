import type { Address, CountryCode } from '@planet-sdk/common';
import type { SetState } from '../../../common/types/common';
import type { AddressAction } from '../../../common/types/profile';
import type { AddressView } from '../donorReceipt';
import type { FormValues } from './DonorContactForm';
import type { Control, UseFormSetValue } from 'react-hook-form';

import { Controller } from 'react-hook-form';
import { useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  ADDRESS_ACTIONS,
  getFormattedAddress,
} from '../../../../utils/addressManagement';
import StyledCheckbox from './StyledCheckbox';
import styles from '../donationReceipt.module.scss';
import EditIcon from '../../../../../public/assets/images/icons/EditIcon';
import DonorAddressCheckIcon from '../../../../../public/assets/images/icons/DonorAddressCheckIcon';
import { isMatchingAddress } from '../utils';

type Props = {
  address: Address;
  setSelectedAddressForAction: SetState<Address | null>;
  setAddressAction: SetState<AddressAction | null>;
  setIsModalOpen: SetState<boolean>;
  receiptAddress: AddressView | undefined;
  checkedAddressGuid: string | null;
  setCheckedAddressGuid: SetState<string | null>;
  control: Control<FormValues>;
  setValue: UseFormSetValue<FormValues>;
};

const DonorAddress = ({
  address,
  setSelectedAddressForAction,
  setAddressAction,
  setIsModalOpen,
  receiptAddress,
  checkedAddressGuid,
  setCheckedAddressGuid,
  control,
  setValue,
}: Props) => {
  const tCountry = useTranslations('Country');
  const t = useTranslations('Donate.donationReceipt');
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

  useEffect(() => {
    if (isMatchingAddress(address, receiptAddress)) {
      setCheckedAddressGuid(address.id);
      setValue('addressGuid', address.id, { shouldValidate: true });
    }
  }, [address, receiptAddress]);

  return (
    <div className={styles.address}>
      <Controller
        name="addressGuid"
        control={control}
        rules={{ required: t('addressRequired') }}
        render={({ field }) => (
          <StyledCheckbox
            {...field}
            checked={checkedAddressGuid === address.id}
            onChange={() => {
              field.onChange(address.id);
              setCheckedAddressGuid(address.id);
            }}
            checkedIcon={<DonorAddressCheckIcon />}
          />
        )}
      />
      <div>
        <address>
          {address.address},{formattedAddress}
        </address>
        {address.address2 && (
          <address>
            {address.address2},{formattedAddress}
          </address>
        )}
      </div>
      <button
        onClick={(e) => {
          e.preventDefault();
          setSelectedAddressForAction(address);
          setAddressAction(ADDRESS_ACTIONS.EDIT);
          setIsModalOpen(true);
        }}
        type="button"
      >
        <EditIcon />
      </button>
    </div>
  );
};

export default DonorAddress;
