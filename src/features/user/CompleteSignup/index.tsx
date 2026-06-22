import type { ReactElement, SyntheticEvent } from 'react';
import type { ExtendedCountryCode } from '../../common/types/country';
import type {
  APIError,
  User,
  UserType,
  CreateUserRequest,
  CountryCode,
} from '@planet-sdk/common';
import type { SnackbarCloseReason } from '@mui/material';

import { useState, useEffect, useMemo } from 'react';
import styles from '../../../../src/features/user/CompleteSignup/CompleteSignup.module.scss';
import { Snackbar, Alert, styled, TextField } from '@mui/material';
import AutoCompleteCountry from '../../common/InputTypes/AutoCompleteCountry';
import { useForm } from 'react-hook-form';
import { getStoredConfig } from '../../../utils/storeConfig';
import { useUserProps } from '../../common/Layout/UserPropsContext';
import { useTranslations } from 'next-intl';
import { handleError } from '@planet-sdk/common';
import { useApi } from '../../../hooks/useApi';
import useLocalizedPath from '../../../hooks/useLocalizedPath';
import { useRouter } from 'next/router';
import SignupToggles from './components/SignupToggles';
import SignupHeader from './components/SignupHeader';
import SignupAddressField from './components/SignupAddressField';
import CompleteSignupLayout from './components/CompleteSignupLayout';
import FullNameInput from './components/FullNameInput';
import OrganizationNameInput from './components/OrganizationNameInput';
import AccountTypeSelector from './components/AccountTypeSelector';
import { useErrorHandlingStore } from '../../../stores/errorHandlingStore';

export const MuiTextField = styled(TextField)(() => {
  return {
    width: '100%',
  };
});

export type SignupFormData = Omit<
  CreateUserRequest,
  'type' | 'country' | 'oAuthAccessToken'
> & {
  isPublic: boolean;
};

const getDefaultLocationValue = (value: string): string => {
  return value === 'T1' || value === 'XX' || value === '' ? '' : value;
};

export default function CompleteSignup(): ReactElement | null {
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({ mode: 'onBlur' });
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  const t = useTranslations('EditProfile');
  const { postApi } = useApi();
  const { user, setUser, auth0User, contextLoaded, token } = useUserProps();
  // local state
  const [isProcessing, setIsProcessing] = useState(false);
  const [country, setCountry] = useState<ExtendedCountryCode | ''>('');
  const [accountType, setAccountType] = useState<UserType>('individual');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false); //  snack bars (for warnings, success messages, errors)
  // store
  const setErrors = useErrorHandlingStore((state) => state.setErrors);

  const isPublic = watch('isPublic');

  useEffect(() => {
    // This will remove field values which do not exist for the new type
    reset();
  }, [accountType, reset]);

  useEffect(() => {
    if (!contextLoaded) return;

    // Already has profile → go to /profile
    if (user) {
      router.push(localizedPath('/profile'));
      return;
    }

    // Not authenticated → go home
    if (token === null) {
      router.push(localizedPath('/'));
      return;
    }
  }, [contextLoaded, token, user]);

  const storedLocation = useMemo(() => getStoredConfig('loc'), []);
  const defaultLocationValues = useMemo(
    () => ({
      city: getDefaultLocationValue(storedLocation.city),
      postalCode: getDefaultLocationValue(storedLocation.postalCode),
      countryCode: getDefaultLocationValue(storedLocation.countryCode),
    }),
    [storedLocation]
  );

  const createUserAccount = async (bodyToSend: CreateUserRequest) => {
    setIsProcessing(true);
    try {
      const res = await postApi<User>('/app/profile', {
        payload: bodyToSend as unknown as Record<string, unknown>,
      });
      // successful signup -> go to profile page
      if (res) {
        setSnackbarOpen(true);
        // Delay redirect to show snackbar
        setTimeout(() => {
          router.push(localizedPath('/profile'));
          setUser(res);
          setIsProcessing(false);
        }, 1000);
      }
    } catch (err) {
      setErrors(handleError(err as APIError));
      const apiError = err as APIError;
      // Only redirect to login for authentication/authorization errors
      // For other errors (400, 500, etc.), stay on the page so user can fix and retry
      if (apiError.statusCode === 401 || apiError.statusCode === 403) {
        router.push(localizedPath('/login'));
      }
      setIsProcessing(false);
    }
  };
  const handleCreateAccount = async (data: SignupFormData) => {
    setFormSubmitted(true);
    if (!agreedToTerms || !country || !contextLoaded || !token) return;

    const { isPublic, ...otherData } = data;
    const submitData = {
      ...otherData,
      country: country as CountryCode,
      isPrivate: !isPublic,
      type: accountType,
      oAuthAccessToken: token,
    };
    await createUserAccount(submitData);
  };
  const handleSnackbarClose = (
    event?: Event | SyntheticEvent,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  // Only show signup form when authenticated but profile doesn't exist
  if (!contextLoaded || user || !token) return null;
  const isSubmitting = isProcessing || user !== null;

  return (
    <CompleteSignupLayout isSubmitting={isSubmitting}>
      <SignupHeader />
      <AccountTypeSelector setAccountType={setAccountType} />
      <FullNameInput control={control} errors={errors} />
      {accountType !== 'individual' && (
        <OrganizationNameInput
          accountType={accountType}
          control={control}
          errors={errors}
        />
      )}
      <MuiTextField
        defaultValue={auth0User?.email}
        label={t('fieldLabels.email')}
        disabled
      />
      <AutoCompleteCountry
        label={t('fieldLabels.country')}
        name="country"
        onChange={setCountry}
        defaultValue={defaultLocationValues.countryCode}
      />
      {accountType === 'tpo' && (
        <SignupAddressField
          control={control}
          country={country}
          setValue={setValue}
          errors={errors}
          defaultCity={defaultLocationValues.city}
          defaultPostalCode={defaultLocationValues.postalCode}
        />
      )}
      <SignupToggles
        control={control}
        isPublic={isPublic}
        agreedToTerms={agreedToTerms}
        setAgreedToTerms={setAgreedToTerms}
        formSubmitted={formSubmitted}
      />
      <div className={styles.horizontalLine} />
      <button
        id={'signupCreate'}
        className={styles.saveButton}
        onClick={handleSubmit(handleCreateAccount)}
        disabled={isSubmitting}
      >
        {isSubmitting ? <div className={styles.spinner} /> : t('createAccount')}
      </button>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
      >
        <Alert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
          severity="success"
        >
          {t('profileCreated')}
        </Alert>
      </Snackbar>
    </CompleteSignupLayout>
  );
}
