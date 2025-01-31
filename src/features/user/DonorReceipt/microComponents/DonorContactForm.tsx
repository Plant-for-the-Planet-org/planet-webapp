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

type Props = {
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
};

type FormInputProps = {
  name: 'firstName' | 'lastName' | 'tin';
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

const DonorContactForm = ({
  donorReceiptData,
  user,
  setSelectedAddressForAction,
  setAddressAction,
  setIsModalOpen,
}: Props) => {
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
          return (
            <DonorAddress
              key={address.id}
              address={address}
              setSelectedAddressForAction={setSelectedAddressForAction}
              setAddressAction={setAddressAction}
              setIsModalOpen={setIsModalOpen}
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
