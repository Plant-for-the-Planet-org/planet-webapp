import type { Address, CountryCode } from '@planet-sdk/common';
import type { SetState } from '../../../common/types/common';
import type { AddressAction } from '../../../common/types/profile';
import type { FormValues } from './DonorContactForm';
import type { Control, UseFormSetValue } from 'react-hook-form';

import { Controller } from 'react-hook-form';
import { useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
    ADDRESS_ACTIONS,
    ADDRESS_TYPE,
    getFormattedAddress,
} from '../../../../utils/addressManagement';
import StyledCheckbox from './StyledCheckbox';
import styles from '../DonationReceipt.module.scss';
import EditIcon from '../../../../../public/assets/images/icons/EditIcon';
import DonorAddressCheckIcon from '../../../../../public/assets/images/icons/DonorAddressCheckIcon';

type Props = {
    address: Address;
    setSelectedAddressForAction: SetState<Address | null>;
    setAddressAction: SetState<AddressAction | null>;
    setIsModalOpen: SetState<boolean>;
    checkedAddressGuid: string | null;
    setCheckedAddressGuid: SetState<string | null>;
    control: Control<FormValues>;
    setValue: UseFormSetValue<FormValues>;
};

const DonorAddressList = ({
                              address,
                              setSelectedAddressForAction,
                              setAddressAction,
                              setIsModalOpen,
                              checkedAddressGuid,
                              setCheckedAddressGuid,
                              control,
                              setValue,
                          }: Props) => {
    const tCountry = useTranslations('Country');
    const t = useTranslations('DonationReceipt');
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
                    setSelectedAddressForAction(address);
                    setAddressAction(ADDRESS_ACTIONS.EDIT);
                    setIsModalOpen(true);
                }}
                type="button"
            >
                <EditIcon />
            </button>
        </section>
    );
};

export default DonorAddressList;