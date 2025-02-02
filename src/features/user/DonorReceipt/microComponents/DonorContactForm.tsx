import type { ReceiptData } from '../donorReceipt';
import type { Address, User } from '@planet-sdk/common';
import type { Control, RegisterOptions } from 'react-hook-form';
import type { SetState } from '../../../common/types/common';
import type { AddressAction } from '../../../common/types/profile';

import { TextField } from '@mui/material';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import styles from '../donationReceipt.module.scss';
import WebappButton from '../../../common/WebappButton';
import InlineFormDisplayGroup from '../../../common/Layout/Forms/InlineFormDisplayGroup';
import DonorAddress from './DonorAddress';
import { ADDRESS_ACTIONS } from '../../../../utils/addressManagement';
import { useState } from 'react';

type Props = {
  donorAddresses: Address[];
  donorReceiptData: ReceiptData | null;
  user: User | null;
  setSelectedAddressForAction: SetState<Address | null>;
  setAddressAction: SetState<AddressAction | null>;
  setIsModalOpen: SetState<boolean>;
};

type FormValues = {
  firstName: string;
  lastName: string;
  tin: string | null;
  companyName: string | null;
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
}: Props) => {
  const tAddressManagement = useTranslations('EditProfile.addressManagement');
  const t = useTranslations('Donate');
  const [checkedAddressGuid, setCheckedAddressGuid] = useState<string | null>(
    null
  );
  if (!user || !donorReceiptData) return null;

  const { handleSubmit, control } = useForm({
    defaultValues: {
      firstName: user.firstname,
      lastName: user.lastname,
      tin: user.tin,
      companyName: user.name,
    },
  });

  //TODO: logic is pending
  const onSubmit = (data: any) => {
    console.log(data, '==1');
  };

  const handleAddNewAddress = () => {
    setIsModalOpen(true);
    setAddressAction(ADDRESS_ACTIONS.ADD);
  };

  return (
    <form className={styles.donorContactForm}>
      <InlineFormDisplayGroup>
        {donorReceiptData.donor.type === 'organization' && (
          <FormInput
            name={'companyName'}
            control={control}
            rules={{ required: t('companyRequired') }}
            label={t('companyName')}
          />
        )}
        {donorReceiptData.donor.type === 'individual' && (
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
        {donorReceiptData.donor.tin && (
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
            />
          );
        })}
      </section>
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
          onClick={handleSubmit(onSubmit)}
          variant="primary"
        />
      </div>
    </form>
  );
};

export default DonorContactForm;
