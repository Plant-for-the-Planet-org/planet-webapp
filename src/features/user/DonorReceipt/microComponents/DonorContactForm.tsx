import type { ReceiptData } from '../donorReceipt';
import type { User } from '@planet-sdk/common';
import type { Control, RegisterOptions } from 'react-hook-form';

import { TextField } from '@mui/material';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import styles from '../donationReceipt.module.scss';
import WebappButton from '../../../common/WebappButton';
import InlineFormDisplayGroup from '../../../common/Layout/Forms/InlineFormDisplayGroup';
import DonorAddress from './DonorAddress';

type Props = {
  donorReceiptData: ReceiptData | null;
  user: User | null;
};

type FormValues = {
  firstName: string;
  lastName: string;
  tin: string | null;
  companyName: string;
};

type FormInputProps = {
  name: 'firstName' | 'lastName' | 'companyName' | 'tin';
  control: Control<FormValues, undefined>;
  rules?: RegisterOptions<FormValues, keyof FormValues>;
  error?: boolean;
  label: string;
};

const FormInput = ({ name, control, rules, error, label }: FormInputProps) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <TextField {...field} variant="outlined" label={label} error={error} />
      )}
    />
  );
};

const DonorContactForm = ({ donorReceiptData, user }: Props) => {
  const tAddressManagement = useTranslations('EditProfile.addressManagement');
  const t = useTranslations('Donate');

  if (!user) return null;
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: user.firstname,
      lastName: user.lastname,
      tin: user.tin,
      companyName: user.firstname,
    },
  });

  //TODO: logic is pending
  const onSubmit = (data: any) => {};
  //TODO: logic is pending
  const handleChange = (id: string) => {};
  //TODO: logic is pending
  const handleAddNewAddress = () => [];

  return (
    <form className={styles.donorContactForm}>
      <InlineFormDisplayGroup>
        {donorReceiptData?.donor.type === 'organization' ? (
          <FormInput
            name={'companyName'}
            control={control}
            rules={{ required: t('companyRequired') }}
            label={t('companyName')}
            error={!!errors.firstName}
          />
        ) : (
          <InlineFormDisplayGroup>
            <FormInput
              name={'firstName'}
              control={control}
              rules={{ required: t('firstNameRequired') }}
              label={t('firstName')}
              error={!!errors.firstName}
            />
            <FormInput
              name={'lastName'}
              control={control}
              rules={{ required: t('lastNameRequired') }}
              label={t('lastName')}
              error={!!errors.lastName}
            />
          </InlineFormDisplayGroup>
        )}
        {donorReceiptData?.donor.tin && (
          <FormInput
            name={'tin'}
            control={control}
            rules={{ required: t('tinRequired') }}
            label={t('donationReceipt.tin')}
            error={!!errors.tin}
          />
        )}
      </InlineFormDisplayGroup>

      <section className={styles.donorAddressSection}>
        {user.addresses.map((address) => {
          return <DonorAddress key={address.id} address={address} />;
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
