import type { ReactElement, SyntheticEvent } from 'react';
import type { ExtendedCountryCode } from '../../common/types/country';
import type {
  APIError,
  User,
  UserType,
  CreateUserRequest,
  CountryCode,
} from '@planet-sdk/common';

import { useState, useContext, useEffect } from 'react';
import styles from '../../../../src/features/user/CompleteSignup/CompleteSignup.module.scss';
import { Snackbar, Alert, styled, TextField } from '@mui/material';
import AutoCompleteCountry from '../../common/InputTypes/AutoCompleteCountry';
import { useForm, Controller } from 'react-hook-form';
import { selectUserType } from '../../../utils/selectUserType';
import { getStoredConfig } from '../../../utils/storeConfig';
import { useUserProps } from '../../common/Layout/UserPropsContext';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import { useTranslations } from 'next-intl';
import InlineFormDisplayGroup from '../../common/Layout/Forms/InlineFormDisplayGroup';
import { handleError } from '@planet-sdk/common';
import { useApi } from '../../../hooks/useApi';
import useLocalizedPath from '../../../hooks/useLocalizedPath';
import { useRouter } from 'next/router';
import SignupToggles from './components/SignupToggles';
import SignupHeader from './components/SignupHeader';
import SignupAddressField from './components/SignupAddressField';
import CompleteSignupLayout from './components/CompleteSignupLayout';
import ProfileTypeSelector from './components/ProfileTypeSelector';

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

export function getValidLocationValue(value: string): string {
  if (value === 'T1' || value === 'XX' || value === '') {
    return '';
  }
  return value;
}

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
  const { setErrors, redirect } = useContext(ErrorHandlingContext);
  const { user, setUser, auth0User, contextLoaded, token } = useUserProps();

  // states
  const [isProcessing, setIsProcessing] = useState(false);
  const [country, setCountry] = useState<ExtendedCountryCode | ''>('');
  const [type, setAccountType] = useState<UserType>('individual');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  //  snack bars (for warnings, success messages, errors)
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const isPublic = watch('isPublic');

  useEffect(() => {
    // This will remove field values which do not exist for the new type
    reset();
  }, [type, reset]);

  useEffect(() => {
    async function loadFunction() {
      if (token) {
        if (user && user.slug) {
          if (typeof window !== 'undefined') {
            router.push(localizedPath('/profile'));
          }
        }
      } else {
        router.push(localizedPath('/'));
      }
    }
    if (contextLoaded) {
      loadFunction();
    }
  }, [contextLoaded, user, token]);

  const createUserProfile = async (bodyToSend: CreateUserRequest) => {
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
          setUser(res);
        }, 2000);
      }
    } catch (err) {
      setErrors(handleError(err as APIError));
      redirect('/login');
    } finally {
      setIsProcessing(false);
    }
  };
  const handleCreateAccount = async (data: SignupFormData) => {
    setFormSubmitted(true);
    if (!agreedToTerms) return;

    if (country !== '') {
      if (contextLoaded && token) {
        const { isPublic, ...otherData } = data;
        const submitData = {
          ...otherData,
          country: country as CountryCode,
          isPrivate: !isPublic,
          type,
          oAuthAccessToken: token,
        };
        createUserProfile(submitData);
      }
    }
  };
  const handleSnackbarClose = (event?: SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  if (
    !contextLoaded ||
    (contextLoaded && token && user) ||
    (contextLoaded && !token)
  ) {
    return null;
  }

  if (contextLoaded && token && user === null) {
    return (
      <CompleteSignupLayout isProcessing={isProcessing}>
        <SignupHeader />
        <ProfileTypeSelector setAccountType={setAccountType} />
        <InlineFormDisplayGroup>
          <Controller
            name="firstname"
            control={control}
            rules={{
              required: t('validationErrors.firstNameRequired'),
              maxLength: {
                value: 50,
                message: t('validationErrors.maxChars', { max: 50 }),
              },
              pattern: {
                value: /^[\p{L}\p{N}ß][\p{L}\p{N}\sß.'-]*$/u,
                message: t('validationErrors.firstNameInvalid'),
              },
            }}
            defaultValue={auth0User?.given_name || ''}
            render={({ field: { onChange, value, onBlur } }) => (
              <MuiTextField
                label={t('fieldLabels.firstName')}
                error={errors.firstname !== undefined}
                helperText={
                  errors.firstname !== undefined && errors.firstname.message
                }
                onChange={onChange}
                value={value}
                onBlur={onBlur}
              />
            )}
          />
          <Controller
            name="lastname"
            control={control}
            rules={{
              required: t('validationErrors.lastNameRequired'),
              maxLength: {
                value: 50,
                message: t('validationErrors.maxChars', { max: 50 }),
              },
              pattern: {
                value: /^[\p{L}\p{N}ß][\p{L}\p{N}\sß'-]*$/u,
                message: t('validationErrors.lastNameInvalid'),
              },
            }}
            defaultValue={auth0User?.family_name || ''}
            render={({ field: { onChange, value, onBlur } }) => (
              <MuiTextField
                label={t('fieldLabels.lastName')}
                error={errors.lastname !== undefined}
                helperText={
                  errors.lastname !== undefined && errors.lastname.message
                }
                onChange={onChange}
                value={value}
                onBlur={onBlur}
              />
            )}
          />
        </InlineFormDisplayGroup>

        {type !== 'individual' ? (
          <Controller
            name="name"
            control={control}
            rules={{
              required: t('validationErrors.nameRequired'),
              pattern: {
                value: /^[\p{L}\p{N}\sß.,'&()!-]+$/u,
                message: t('validationErrors.nameInvalid'),
              },
            }}
            render={({ field: { onChange, value, onBlur } }) => (
              <MuiTextField
                label={t('fieldLabels.name', {
                  type: selectUserType(type, t),
                })}
                error={errors.name !== undefined}
                helperText={errors.name !== undefined && errors.name.message}
                onChange={onChange}
                value={value}
                onBlur={onBlur}
              />
            )}
          />
        ) : null}

        <MuiTextField
          defaultValue={auth0User?.email}
          label={t('fieldLabels.email')}
          disabled
        />
        <AutoCompleteCountry
          label={t('fieldLabels.country')}
          name="country"
          onChange={setCountry}
          defaultValue={getValidLocationValue(
            getStoredConfig('loc').countryCode
          )}
        />
        {type === 'tpo' && (
          <SignupAddressField
            control={control}
            country={country}
            setValue={setValue}
            errors={errors}
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
          disabled={isProcessing}
        >
          {isProcessing ? (
            <div className={styles.spinner}></div>
          ) : (
            t('createAccount')
          )}
        </button>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={() => handleSnackbarClose}
        >
          <div>
            <Alert
              elevation={6}
              variant="filled"
              onClose={handleSnackbarClose}
              severity="success"
            >
              {t('profileCreated')}
            </Alert>
          </div>
        </Snackbar>
      </CompleteSignupLayout>
    );
  }

  return null;
}
