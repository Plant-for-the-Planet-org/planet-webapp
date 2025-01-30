import type { ReceiptData } from '../donorReceipt';
import type { CountryCode, User } from '@planet-sdk/common';

import { TextField } from '@mui/material';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import styles from '../donationReceipt.module.scss';
import { getFormattedAddress } from '../../../../utils/addressManagement';
import DonorAddressCheckIcon from '../../../../../public/assets/images/icons/DonorAddressCheckIcon';
import StyledCheckbox from './StyledCheckBox';
import EditIcon from '../../../../../public/assets/images/icons/EditIcon';

type Props = {
  donorReceiptData: ReceiptData | null;
  user: User | null;
};

const DonorContactForm = ({ donorReceiptData, user }: Props) => {
  const tCountry = useTranslations('Country');
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
      selectedAddressId: '',
    },
  });
  const t = useTranslations('Donate');

  //TODO: logic is pending
  const onSubmit = (data: any) => {};
  //TODO: logic is pending
  const handleChange = (id: string) => {};
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.donorContactForm}>
      <div className={styles.donorNameContainer}>
        {donorReceiptData?.donor.type === 'organization' ? (
          <Controller
            name="companyName"
            control={control}
            rules={{ required: 'Company name is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                variant="outlined"
                label={t('companyName')}
                error={!!errors.firstName}
              />
            )}
          />
        ) : (
          <>
            <Controller
              name="firstName"
              control={control}
              rules={{ required: 'First name is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  variant="outlined"
                  label={t('firstName')}
                  error={!!errors.firstName}
                />
              )}
            />
            <Controller
              name="lastName"
              control={control}
              rules={{ required: 'Last name is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  variant="outlined"
                  label={t('lastName')}
                  error={!!errors.firstName}
                />
              )}
            />
          </>
        )}
        {donorReceiptData?.donor.tin && (
          <Controller
            name="tin"
            control={control}
            rules={{ required: 'tin is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                variant="outlined"
                label={t('donationReceipt.tin')}
                error={!!errors.tin}
              />
            )}
          />
        )}
      </div>
      <section className={styles.donorAddressSection}>
        {user.addresses.map((address) => {
          return (
            <>
              <div className={styles.address} key={address.id}>
                <Controller
                  name="selectedAddressId"
                  control={control}
                  render={({ field }) => (
                    <StyledCheckbox
                      checked={String(field.value) === String(address.id)}
                      onChange={() =>
                        field.onChange(
                          field.value === address.id ? '' : address.id
                        )
                      }
                      checkedIcon={<DonorAddressCheckIcon />}
                    />
                  )}
                />
                <address>
                  {getFormattedAddress(
                    address.zipCode,
                    address.city,
                    null,
                    tCountry(
                      address.country.toLowerCase() as Lowercase<CountryCode>
                    )
                  )}
                </address>
                <button>
                  <EditIcon />
                </button>
              </div>
            </>
          );
        })}
      </section>
    </form>
  );
};

export default DonorContactForm;
