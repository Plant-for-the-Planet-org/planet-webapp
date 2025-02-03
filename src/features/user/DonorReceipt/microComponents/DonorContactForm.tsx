import type { ReceiptData } from '../donorReceipt';
import type { Address, User } from '@planet-sdk/common';
import type { Control, RegisterOptions } from 'react-hook-form';
import type { SetState } from '../../../common/types/common';
import type { AddressAction } from '../../../common/types/profile';

import { useState } from 'react';
import { CircularProgress, TextField } from '@mui/material';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import styles from '../donationReceipt.module.scss';
import WebappButton from '../../../common/WebappButton';
import InlineFormDisplayGroup from '../../../common/Layout/Forms/InlineFormDisplayGroup';
import DonorAddress from './DonorAddress';
import { ADDRESS_ACTIONS } from '../../../../utils/addressManagement';

type Props = {
  donorAddresses: Address[];
  donorReceiptData: ReceiptData | null;
  user: User | null;
  setSelectedAddressForAction: SetState<Address | null>;
  setAddressAction: SetState<AddressAction | null>;
  setIsModalOpen: SetState<boolean>;
  isLoading: boolean;
  updateDonorProfile: (data: FormValues) => Promise<void>;
};

export type FormValues = {
  firstName: string;
  lastName: string;
  tin: string;
  companyName: string;
  addressGuid: string;
};

type FormInputProps = {
  name: keyof FormValues;
  control: Control<FormValues>;
  rules?: RegisterOptions<FormValues>;
  label: string;
};

const FormInput = ({ name, control, rules, label }: FormInputProps) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          variant="outlined"
          label={label}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
        />
      )}
    />
  );
};

const DonorContactForm = ({
  donorAddresses,
  donorReceiptData,
  user,
  setSelectedAddressForAction,
  setAddressAction,
  setIsModalOpen,
  isLoading,
  updateDonorProfile,
}: Props) => {
  const tAddressManagement = useTranslations('EditProfile.addressManagement');
  const t = useTranslations('Donate');
  const [checkedAddressGuid, setCheckedAddressGuid] = useState<string | null>(
    null
  );

  if (!user) return null;

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: user.firstname || '',
      lastName: user.lastname || '',
      tin: user.tin || '',
      companyName: user.name || '',
      addressGuid: checkedAddressGuid || '',
    },
  });

  const handleAddNewAddress = () => {
    setIsModalOpen(true);
    setAddressAction(ADDRESS_ACTIONS.ADD);
  };
  return (
    <form className={styles.donorContactForm}>
      <InlineFormDisplayGroup>
        {donorReceiptData?.donor.type === 'organization' && (
          <FormInput
            name={'companyName'}
            control={control}
            rules={{ required: t('companyRequired') }}
            label={t('companyName')}
          />
        )}
        {user.type === 'individual' && (
          <InlineFormDisplayGroup>
            <FormInput
              name={'firstName'}
              control={control}
              rules={{ required: t('firstNameRequired') }}
              label={t('firstName')}
            />
            <FormInput
              name={'lastName'}
              control={control}
              rules={{ required: t('lastNameRequired') }}
              label={t('lastName')}
            />
          </InlineFormDisplayGroup>
        )}
        {donorReceiptData?.donor.tin && (
          <FormInput
            name={'tin'}
            control={control}
            rules={{ required: t('tinRequired') }}
            label={t('donationReceipt.tin')}
          />
        )}
      </InlineFormDisplayGroup>

      <section className={styles.donorAddressSection}>
        {donorAddresses.map((address) => {
          return (
            <DonorAddress
              key={address.id}
              address={address}
              setSelectedAddressForAction={setSelectedAddressForAction}
              setAddressAction={setAddressAction}
              setIsModalOpen={setIsModalOpen}
              receiptAddress={donorReceiptData?.address}
              checkedAddressGuid={checkedAddressGuid}
              setCheckedAddressGuid={setCheckedAddressGuid}
              control={control}
            />
          );
        })}
        {errors.addressGuid?.message && (
          <span className={styles.errorMessage}>
            {errors.addressGuid?.message}
          </span>
        )}
      </section>
      {!isLoading ? (
        <div className={styles.donorContactFormAction}>
          <WebappButton
            text={tAddressManagement('actions.addAddress')}
            elementType="button"
            onClick={handleAddNewAddress}
            variant="secondary"
          />
          <WebappButton
            text={t('donationReceipt.saveDataAndReturn')}
            elementType="button"
            onClick={handleSubmit(updateDonorProfile)}
            variant="primary"
          />
        </div>
      ) : (
        <div className={styles.donorReceiptSpinner}>
          <CircularProgress color="success" />
        </div>
      )}
    </form>
  );
};

export default DonorContactForm;
