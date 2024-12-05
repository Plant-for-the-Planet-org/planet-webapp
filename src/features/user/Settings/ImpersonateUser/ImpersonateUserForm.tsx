import {ReactElement, useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {useTranslations} from 'next-intl';
import {Controller, useForm} from 'react-hook-form';
import {TextField, Button} from '@mui/material';
import {getAccountInfo} from '../../../../utils/apiRequests/api';
import {useUserProps} from '../../../common/Layout/UserPropsContext';
import StyledForm from '../../../common/Layout/StyledForm';
import {useTenant} from '../../../common/Layout/TenantContext';
import styles from './ImpersonateUser.module.scss';
import {isEmailValid} from '../../../../utils/isEmailValid';
import type {ImpersonationData} from "../../../../types/impersonation";

const ImpersonateUserForm = (): ReactElement => {
    const router = useRouter();
    const {tenantConfig} = useTenant();
    const t = useTranslations('Me');
    const [hasUpdatedUrl, setHasUpdatedUrl] = useState(false);
    const [isInvalidEmail, setIsInvalidEmail] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const {token, setUser, setIsImpersonationModeOn} = useUserProps();
    const {
        control,
        handleSubmit,
        formState: {errors},
        setValue,
    } = useForm<ImpersonationData>({
        mode: 'onBlur',
        defaultValues: {
            targetEmail: '',
            supportPin: '',
        },
    });

    useEffect(() => {
        if (router.isReady && !hasUpdatedUrl) {
            let shouldUpdateUrl = false;

            if (router.query.email && typeof router.query.email === 'string') {
                setValue('targetEmail', router.query.email);
                shouldUpdateUrl = true;
            }

            if (
                router.query.support_pin &&
                typeof router.query.support_pin === 'string'
            ) {
                setValue('supportPin', router.query.support_pin);
                shouldUpdateUrl = true;
            }

            if (shouldUpdateUrl) {
                // Remove only the email and support_pin query parameters
                const url = new URL(router.asPath, window.location.origin);
                url.searchParams.delete('email');
                url.searchParams.delete('support_pin');

                // Use router.replace with the modified URL string
                router.replace(url.pathname + url.search, undefined, {shallow: true});
                setHasUpdatedUrl(true);
            }
        }
    }, [router.isReady, router.query, hasUpdatedUrl, setValue]);

    const handleImpersonation = async (
        data: ImpersonationData
    ): Promise<void> => {
        if (data.targetEmail && data.supportPin) {
            setIsProcessing(true);
            try {
                const res = await getAccountInfo(tenantConfig?.id, token, data);
                const resJson = await res.json();
                if (res.status === 200) {
                    setIsInvalidEmail(false);
                    setIsImpersonationModeOn(true);
                    const impersonationData: ImpersonationData = {
                        targetEmail: resJson.email,
                        supportPin: resJson.supportPin,
                    };

                    localStorage.setItem(
                        'impersonationData',
                        JSON.stringify(impersonationData)
                    );
                    setUser(resJson);
                    router.push('/profile');
                } else {
                    setIsInvalidEmail(true);
                    setIsProcessing(false);
                }
            } catch (err) {
                console.log(err);
                setIsProcessing(false);
            }
        }
    };

    return (
        <StyledForm onSubmit={handleSubmit(handleImpersonation)}>
            <div className="inputContainer">
                <Controller
                    name="targetEmail"
                    control={control}
                    rules={{
                        required: {
                            value: true,
                            message: t('enterTheEmail'),
                        },
                        validate: {
                            emailInvalid: (value) =>
                                value.length === 0 || isEmailValid(value) || t('invalidEmail'),
                        },
                    }}
                    render={({field: {onChange, value, onBlur}}) => (
                        <TextField
                            label={t('profileEmail')}
                            placeholder="xyz@email.com"
                            onChange={onChange}
                            onBlur={onBlur}
                            value={value}
                            error={errors.targetEmail !== undefined || isInvalidEmail}
                            helperText={
                                (errors.targetEmail !== undefined &&
                                    errors.targetEmail.message) ||
                                (isInvalidEmail && t('wrongEntered'))
                            }
                        />
                    )}
                />
                <Controller
                    name="supportPin"
                    control={control}
                    rules={{
                        required: t('enterSupportPin'),
                    }}
                    render={({field: {onChange, value, onBlur}}) => (
                        <TextField
                            label={t('supportPin')}
                            placeholder={t('alphaNumeric')}
                            onChange={onChange}
                            onBlur={onBlur}
                            value={value}
                            error={errors.supportPin !== undefined || isInvalidEmail}
                            helperText={
                                (errors.supportPin !== undefined &&
                                    errors.supportPin.message) ||
                                (isInvalidEmail && t('wrongEntered'))
                            }
                        />
                    )}
                />
            </div>
            <Button
                variant="contained"
                color="primary"
                type="submit"
                className="formButton"
                disabled={isProcessing}
            >
                {isProcessing ? <div className={styles.spinner}></div> : t('switch')}
            </Button>
        </StyledForm>
    );
};

export default ImpersonateUserForm;
