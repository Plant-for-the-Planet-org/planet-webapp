import type { ReceiptData } from '../donorReceipt';
import type { APIError, Address, User } from '@planet-sdk/common';
import type { Control, RegisterOptions } from 'react-hook-form';
import type { SetState } from '../../../common/types/common';
import type { AddressAction } from '../../../common/types/profile';

import { useCallback, useContext, useState } from 'react';
import { handleError } from '@planet-sdk/common';
import { CircularProgress, TextField } from '@mui/material';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import styles from '../donationReceipt.module.scss';
import WebappButton from '../../../common/WebappButton';
import InlineFormDisplayGroup from '../../../common/Layout/Forms/InlineFormDisplayGroup';
import DonorAddress from './DonorAddress';
import { ADDRESS_ACTIONS } from '../../../../utils/addressManagement';
import { getUpdatedDonorDetails } from '../utils';
import { putAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import { useTenant } from '../../../common/Layout/TenantContext';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';

type Props = {
  donorAddresses: Address[];
  donorReceiptData: ReceiptData | null;
  setDonorReceiptData: SetState<ReceiptData | null>;
  setSelectedAddressForAction: SetState<Address | null>;
  setAddressAction: SetState<AddressAction | null>;
  setIsModalOpen: SetState<boolean>;
  isLoading: boolean;
  setIsLoading: SetState<boolean>;
  navigateToVerificationPage: () => void;
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
  setDonorReceiptData,
  setSelectedAddressForAction,
  setAddressAction,
  setIsModalOpen,
  isLoading,
  setIsLoading,
  navigateToVerificationPage,
}: Props) => {
  const tAddressManagement = useTranslations('EditProfile.addressManagement');
  const t = useTranslations('Donate');
  const { user, contextLoaded, token, setUser, logoutUser } = useUserProps();
  const { setErrors } = useContext(ErrorHandlingContext);
  const { tenantConfig } = useTenant();
  const [checkedAddressGuid, setCheckedAddressGuid] = useState<string | null>(
    null
  );

  if (!user) return null;

  const {
    handleSubmit,
    control,
    formState: { errors, dirtyFields },
    setValue,
  } = useForm({
    defaultValues: {
      firstName: user.firstname || '',
      lastName: user.lastname || '',
      tin: user.tin || '',
      companyName: user.name || '',
      addressGuid: checkedAddressGuid || '',
    },
  });
  const isUserDataChanged = Boolean(
    dirtyFields.firstName ||
      dirtyFields.lastName ||
      dirtyFields.companyName ||
      dirtyFields.tin
  );
  const handleAddNewAddress = () => {
    setIsModalOpen(true);
    setAddressAction(ADDRESS_ACTIONS.ADD);
  };

  const updateDonorInfo = useCallback(
    async (data: FormValues) => {
      setIsLoading(true);
      if (!user || !token || !contextLoaded) return;

      try {
        let updatedUser: User | null = user;
        if (isUserDataChanged) {
          const body =
            user?.type === 'individual'
              ? {
                  firstName: data.firstName,
                  lastName: data.lastName,
                  tin: data.tin,
                }
              : { name: data.companyName, tin: data.tin };

          updatedUser = await putAuthenticatedRequest<User | null>({
            tenant: tenantConfig.id,
            url: '/app/profile',
            data: body,
            token,
            logoutUser,
          });

          if (!updatedUser) return;
          setUser(updatedUser);
        }

        setDonorReceiptData((prev) => {
          if (!prev) return null;
          const { donorName, address1, address2, country, zipCode, city } =
            getUpdatedDonorDetails(updatedUser, checkedAddressGuid);

          return {
            ...prev,
            donor: {
              ...prev.donor,
              tin: updatedUser.tin,
              name: donorName,
            },
            address: {
              ...prev.address,
              guid: checkedAddressGuid,
              address1,
              address2,
              country,
              zipCode,
              city,
            },
            hasDonorDataChanged: true,
          };
        });
        navigateToVerificationPage();
      } catch (err) {
        setErrors(handleError(err as APIError));
        setIsLoading(false);
      }
    },
    [
      user,
      token,
      contextLoaded,
      isUserDataChanged,
      tenantConfig.id,
      logoutUser,
      setUser,
      checkedAddressGuid,
      setDonorReceiptData,
      navigateToVerificationPage,
      setErrors,
    ]
  );

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
        {donorReceiptData?.donor.type === 'individual' && (
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
        {donorReceiptData?.donor.tin !== null && (
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
              setValue={setValue}
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
            onClick={handleSubmit(updateDonorInfo)}
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
