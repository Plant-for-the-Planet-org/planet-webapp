import type {Address, User} from '@planet-sdk/common';
import type {Control, RegisterOptions} from 'react-hook-form';
import type {SetState} from '../../../common/types/common';
import type {AddressAction} from '../../../common/types/profile';

import {useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {CircularProgress, TextField} from '@mui/material';
import {useTranslations} from 'next-intl';
import styles from '../DonationReceipt.module.scss';
import WebappButton from '../../../common/WebappButton';
import InlineFormDisplayGroup from '../../../common/Layout/Forms/InlineFormDisplayGroup';
import DonorAddressList from './DonorAddressList';

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
    setIsLoading: SetState<boolean>;
    setIsModalOpen: SetState<boolean>;
    setSelectedAddressForAction: SetState<Address | null>;
    tinIsRequired: boolean;
    user: User | null;
};

type FormInputProps = {
    name: keyof FormValues;
    control: Control<FormValues>;
    rules?: RegisterOptions<FormValues>;
    label: string;
    tinIsRequired?: boolean;
};

const FormInput = ({name, control, rules, label}: FormInputProps) => (
    <Controller
        name={name}
        control={control}
        rules={rules}
        render={({field, fieldState}) => (
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
                              setSelectedAddressForAction,
                              setAddressAction,
                              setIsModalOpen,
                              isLoading,
                              checkedAddressGuid,
                              setCheckedAddressGuid,
                          }: Props) => {
    const tAddressManagement = useTranslations('EditProfile.addressManagement');
    const t = useTranslations('DonationReceipt');
    const {control, handleSubmit, setValue, reset, formState: {errors}} = useForm<FormValues>({
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
        setAddressAction('ADD' as AddressAction);
    };

    return (
        <form className={styles.donorContactForm} onSubmit={handleSubmit(onSubmit)}>
            <InlineFormDisplayGroup>
                <FormInput
                    name="firstName"
                    control={control}
                    rules={{required: t('donorInfo.firstNameRequired')}}
                    label={t('donorInfo.firstName')}
                />
                <FormInput
                    name="lastName"
                    control={control}
                    rules={{required: t('donorInfo.lastNameRequired')}}
                    label={t('donorInfo.lastName')}
                />
                <FormInput
                    name="tin"
                    control={control}
                    rules={{required: t('donorInfo.tinRequired')}}
                    label={t('donorInfo.tin')}
                />
                <FormInput
                    name="companyName"
                    control={control}
                    label={t('donorInfo.companyName')}
                />
            </InlineFormDisplayGroup>

            <section className={styles.donorAddressSection}>
                {donorAddresses.map((address) => (
                    <DonorAddressList
                        key={address.id}
                        address={address}
                        setSelectedAddressForAction={setSelectedAddressForAction}
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

            {isLoading && (
                <div className={styles.donationReceiptSpinner}>
                    <CircularProgress color="success"/>
                </div>
            )}
        </form>
    );
};

export default DonorContactForm;