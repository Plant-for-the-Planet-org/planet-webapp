import type { Address, User } from '@planet-sdk/common';
import type { Control, RegisterOptions } from 'react-hook-form';
import type { SetState } from '../../../common/types/common';
import type { AddressAction } from '../../../common/types/profile';

import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { CircularProgress, TextField } from '@mui/material';
import { useTranslations } from 'next-intl';
import styles from '../DonationReceipt.module.scss';
import WebappButton from '../../../common/WebappButton';
import InlineFormDisplayGroup from '../../../common/Layout/Forms/InlineFormDisplayGroup';
import DonorAddressList from './DonorAddressList';
import { ADDRESS_ACTIONS } from '../../../../utils/addressManagement';

export type FormValues = {
  firstName: string;
  lastName: string;
  tin: string;
  companyName: string;
  addressGuid: string;
};

type Props = {
  checkedAddressGuid: string | null;
  donorAddresses: Address[];
  isLoading: boolean;
  onSubmit: (data: FormValues) => void;
  setAddressAction: SetState<AddressAction | null>;
  setCheckedAddressGuid: SetState<string | null>;
  setIsModalOpen: SetState<boolean>;
  setSelectedAddress: SetState<Address | null>;
  user: User | null;
  tinIsRequired: boolean;
};

type FormInputProps = {
  name: keyof FormValues;
  control: Control<FormValues>;
  rules?: RegisterOptions<FormValues>;
  label: string;
};

const FormInput = ({ name, control, rules, label }: FormInputProps) => (
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

const DonorContactForm = ({
  user,
  donorAddresses,
  onSubmit,
  setSelectedAddress,
  setAddressAction,
  setIsModalOpen,
  isLoading,
  checkedAddressGuid,
  setCheckedAddressGuid,
  tinIsRequired,
}: Props) => {
  const tAddressManagement = useTranslations('EditProfile.addressManagement');
  const t = useTranslations('DonationReceipt');
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      tin: '',
      companyName: '',
      addressGuid: checkedAddressGuid ?? '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstname ?? '',
        lastName: user.lastname ?? '',
        tin: user.tin ?? '',
        companyName: user.name ?? '',
        addressGuid: checkedAddressGuid ?? '',
      });
    }
  }, [user, checkedAddressGuid, reset]);

  const handleAddNewAddress = () => {
    setIsModalOpen(true);
    setAddressAction(ADDRESS_ACTIONS.ADD);
  };

  return (
    <form className={styles.donorContactForm}>
      <InlineFormDisplayGroup>
        {user?.type === 'individual' && (
          <>
            <FormInput
              name="firstName"
              control={control}
              rules={{ required: t('notifications.firstNameRequired') }}
              label={t('donorInfo.firstName')}
            />
            <FormInput
              name="lastName"
              control={control}
              rules={{ required: t('notifications.lastNameRequired') }}
              label={t('donorInfo.lastName')}
            />
          </>
        )}
        {tinIsRequired && (
          <FormInput
            name="tin"
            control={control}
            rules={{
              required: t('notifications.tinRequired'),
            }}
            label={t('donorInfo.tin')}
          />
        )}
        {user?.type !== 'individual' && (
          <FormInput
            name="companyName"
            control={control}
            label={t('donorInfo.companyName')}
            rules={{ required: t('notifications.companyRequired') }}
          />
        )}
      </InlineFormDisplayGroup>

      <section className={styles.donorAddressSection}>
        {donorAddresses.map((address) => (
          <DonorAddressList
            key={address.id}
            address={address}
            setSelectedAddress={setSelectedAddress}
            setAddressAction={setAddressAction}
            setIsModalOpen={setIsModalOpen}
            checkedAddressGuid={checkedAddressGuid}
            setCheckedAddressGuid={setCheckedAddressGuid}
            control={control}
            setValue={setValue}
          />
        ))}
        {errors.addressGuid?.message && (
          <span className={styles.errorMessage}>
            {errors.addressGuid.message}
          </span>
        )}
      </section>

      {!isLoading && (
        <div className={styles.donorContactFormAction}>
          <WebappButton
            text={tAddressManagement('actions.addAddress')}
            elementType="button"
            onClick={handleAddNewAddress}
            variant="secondary"
          />
          <WebappButton
            text={t('saveDataAndReturn')}
            elementType="button"
            onClick={handleSubmit(onSubmit)}
            variant="primary"
          />
        </div>
      )}

      {isLoading && (
        <div className={styles.donationReceiptSpinner}>
          <CircularProgress color="success" />
        </div>
      )}
    </form>
  );
};

export default DonorContactForm;
