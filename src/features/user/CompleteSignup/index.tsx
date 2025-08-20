import type { ReactElement, SyntheticEvent } from 'react';
import type { AddressSuggestionsType } from '../../common/types/geocoder';
import type { ExtendedCountryCode } from '../../common/types/country';
import type {
  APIError,
  User,
  UserType,
  CreateUserRequest,
  CountryCode,
} from '@planet-sdk/common';

import {
  useCallback,
  useState,
  useContext,
  useMemo,
  useEffect,
  useRef,
} from 'react';
import styles from '../../../../src/features/user/CompleteSignup/CompleteSignup.module.scss';
import NewToggleSwitch from '../../common/InputTypes/NewToggleSwitch';
import { Snackbar, Alert, MenuItem, styled, TextField } from '@mui/material';
import AutoCompleteCountry from '../../common/InputTypes/AutoCompleteCountry';
import { useForm, Controller } from 'react-hook-form';
import CancelIcon from '../../../../public/assets/images/icons/CancelIcon';
import { selectUserType } from '../../../utils/selectUserType';
import { getStoredConfig } from '../../../utils/storeConfig';
import { useUserProps } from '../../common/Layout/UserPropsContext';
import themeProperties from '../../../theme/themeProperties';
import { ThemeContext } from '../../../theme/themeContext';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import { useLocale, useTranslations } from 'next-intl';
import InlineFormDisplayGroup from '../../common/Layout/Forms/InlineFormDisplayGroup';
import { handleError } from '@planet-sdk/common';
import { useApi } from '../../../hooks/useApi';
import useLocalizedRouter from '../../../hooks/useLocalizedRouter';
import {
  getAddressDetailsFromText,
  getAddressSuggestions,
} from '../../../utils/geocoder';
import { useDebouncedEffect } from '../../../utils/useDebouncedEffect';
import { getPostalRegex } from '../../../utils/addressManagement';

const MuiTextField = styled(TextField)(() => {
  return {
    width: '100%',
  };
});

type FormData = Omit<
  CreateUserRequest,
  'type' | 'country' | 'oAuthAccessToken'
> & {
  isPublic: boolean;
};

export default function CompleteSignup(): ReactElement | null {
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({ mode: 'onBlur' });
  const { push } = useLocalizedRouter();
  const t = useTranslations('EditProfile');
  const locale = useLocale();
  const { postApi } = useApi();
  const { setErrors, redirect } = useContext(ErrorHandlingContext);
  const { theme } = useContext(ThemeContext);
  const { user, setUser, auth0User, contextLoaded, logoutUser, token } =
    useUserProps();

  // states
  const [addressSuggestions, setAddressSuggestions] = useState<
    AddressSuggestionsType[]
  >([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [country, setCountry] = useState<ExtendedCountryCode | ''>('');
  const [type, setAccountType] = useState<UserType>('individual');
  const [requestSent, setRequestSent] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState<boolean | null>(null);
  const [submit, setSubmit] = useState(false);
  //  snack bars (for warnings, success messages, errors)
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [addressInput, setAddressInput] = useState('');
  const latestRequestIdRef = useRef(0);

  const postalRegex = useMemo(() => getPostalRegex(country), [country]);
  const profileTypes = [
    {
      id: 1,
      title: t('individual'),
      value: 'individual',
    },
    {
      id: 2,
      title: t('organization'),
      value: 'organization',
    },
    { id: 3, title: t('tpo'), value: 'tpo' },
    {
      id: 4,
      title: t('education'),
      value: 'education',
    },
  ] as const;
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
            push('/profile');
          }
        }
      } else {
        push('/');
      }
    }
    if (contextLoaded) {
      loadFunction();
    }
  }, [contextLoaded, user, token]);

  const handleSnackbarOpen = () => {
    setSnackbarOpen(true);
  };

  const sendRequest = async (bodyToSend: CreateUserRequest) => {
    setRequestSent(true);
    setIsProcessing(true);
    try {
      const res = await postApi<User>('/app/profile', {
        payload: bodyToSend as unknown as Record<string, unknown>,
      });
      setRequestSent(false);
      // successful signup -> go to me page
      setUser(res);
      handleSnackbarOpen();

      if (typeof window !== 'undefined') {
        push('/t/[id]', `/t/${res.slug}`);
      }
    } catch (err) {
      setIsProcessing(false);
      setErrors(handleError(err as APIError));
      redirect('/login');
    }
  };

  const handleSnackbarClose = (event?: SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleTermsAndCondition = (value: boolean) => {
    setAcceptTerms(value);
    if (!value) {
      setSubmit(false);
    }
  };

  const createButtonClicked = async (data: FormData) => {
    if (!acceptTerms) {
      handleTermsAndCondition(false);
      return;
    }
    setSubmit(true);
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
        sendRequest(submitData);
      }
    }
  };
  const handleSuggestAddress = useCallback(
    async (value: string) => {
      // Bump request ID to track the latest API call
      latestRequestIdRef.current++;
      const currentRequestId = latestRequestIdRef.current;
      try {
        const suggestions = await getAddressSuggestions(value, country);
        // Only update if this is still the latest request
        if (currentRequestId === latestRequestIdRef.current) {
          setAddressSuggestions(suggestions);
        }
      } catch (error) {
        console.error('Failed to fetch address suggestions:', error);
        // Prevent outdated error responses from affecting UI
        if (currentRequestId === latestRequestIdRef.current) {
          setAddressSuggestions([]);
        }
      }
    },
    [country]
  );

  const handleAddressSelection = useCallback(
    async (value: string) => {
      try {
        const details = await getAddressDetailsFromText(value);
        if (details) {
          setValue('address', details.address, { shouldValidate: true });
          setValue('city', details.city, { shouldValidate: true });
          setValue('zipCode', details.zipCode, { shouldValidate: true });
        }
        setAddressSuggestions([]);
      } catch (error) {
        console.error('Failed to fetch address details:', error);
      }
    },
    [setValue]
  );

  useDebouncedEffect(
    () => {
      const trimmedInput = addressInput.trim();

      // Clear suggestions if input is empty or just whitespace
      if (trimmedInput === '') {
        setAddressSuggestions([]);
        return;
      }

      // Fetch suggestions only if input is meaningful (e.g., length > 3)
      handleSuggestAddress(trimmedInput);
    },
    700,
    [addressInput]
  );

  if (
    !contextLoaded ||
    (contextLoaded && token && user) ||
    (contextLoaded && !token)
  ) {
    return null;
  }

  if (contextLoaded && token && user === null) {
    return (
      <div
        className={styles.signupPage}
        style={{
          backgroundImage: `url(${process.env.CDN_URL}/media/images/app/bg_layer.jpg)`,
        }}
      >
        <div className={styles.signupContainer}>
          <div
            className={requestSent ? styles.signupRequestSent : styles.signup}
            style={{
              backgroundColor:
                theme === 'theme-light'
                  ? themeProperties.designSystem.colors.white
                  : themeProperties.dark.backgroundColor,
              color:
                theme === 'theme-light'
                  ? themeProperties.designSystem.colors.coreText
                  : themeProperties.dark.primaryFontColor,
            }}
          >
            {/* header */}
            <div className={styles.header}>
              <div
                onClick={() => logoutUser(`${window.location.origin}/`)}
                className={styles.headerBackIcon}
              >
                <CancelIcon
                  color={themeProperties.designSystem.colors.coreText}
                />
              </div>
              <div className={styles.headerTitle}>{t('signUpText')}</div>
            </div>

            {/* type of account buttons */}
            <MuiTextField
              label={t('fieldLabels.profileType')}
              select
              defaultValue={profileTypes[0].value}
            >
              {profileTypes.map((option) => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                  onClick={() => setAccountType(option.value)}
                >
                  {option.title}
                </MenuItem>
              ))}
            </MuiTextField>

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
                    helperText={
                      errors.name !== undefined && errors.name.message
                    }
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

            {type === 'tpo' ? (
              <>
                <Controller
                  name="address"
                  control={control}
                  rules={{
                    required: t('validationErrors.addressRequired'),
                    pattern: {
                      value: /^[\p{L}\p{N}\sß.,#/-]+$/u,
                      message: t('validationErrors.addressInvalid'),
                    },
                  }}
                  render={({ field: { onChange, value, onBlur } }) => (
                    <MuiTextField
                      label={t('fieldLabels.address')}
                      error={errors.address !== undefined}
                      helperText={
                        errors.address !== undefined && errors.address.message
                      }
                      onChange={(event) => {
                        setAddressInput(event.target.value);
                        onChange(event.target.value);
                      }}
                      onBlur={() => {
                        setAddressSuggestions([]);
                        onBlur();
                      }}
                      value={value}
                    />
                  )}
                />
                {addressSuggestions
                  ? addressSuggestions.length > 0 && (
                      <div className="suggestions-container">
                        {addressSuggestions.map((suggestion, index) => {
                          return (
                            <div
                              key={index}
                              onMouseDown={() => {
                                handleAddressSelection(suggestion.text);
                              }}
                              className="suggestion"
                            >
                              {suggestion.text}
                            </div>
                          );
                        })}
                      </div>
                    )
                  : null}
                <InlineFormDisplayGroup>
                  <Controller
                    name="city"
                    control={control}
                    rules={{
                      required: t('validationErrors.cityRequired'),
                      pattern: {
                        value: /^[\p{L}\sß.,()-]+$/u,
                        message: t('validationErrors.cityInvalid'),
                      },
                    }}
                    defaultValue={
                      getStoredConfig('loc').city === 'T1' ||
                      getStoredConfig('loc').city === 'XX' ||
                      getStoredConfig('loc').city === ''
                        ? ''
                        : getStoredConfig('loc').city
                    }
                    render={({ field: { onChange, value, onBlur } }) => (
                      <MuiTextField
                        label={t('fieldLabels.city')}
                        error={errors.city !== undefined}
                        helperText={
                          errors.city !== undefined && errors.city.message
                        }
                        onChange={onChange}
                        value={value}
                        onBlur={onBlur}
                      />
                    )}
                  />
                  <Controller
                    name="zipCode"
                    control={control}
                    rules={{
                      required: t('validationErrors.zipCodeRequired'),
                      pattern: {
                        value: postalRegex as RegExp,
                        message: t('validationErrors.zipCodeInvalid'),
                      },
                      maxLength: {
                        value: 15,
                        message: t('validationErrors.zipCodeInvalid'),
                      },
                    }}
                    defaultValue={
                      getStoredConfig('loc').postalCode === 'T1' ||
                      getStoredConfig('loc').postalCode === 'XX' ||
                      getStoredConfig('loc').postalCode === ''
                        ? ''
                        : getStoredConfig('loc').postalCode
                    }
                    render={({ field: { onChange, value, onBlur } }) => (
                      <MuiTextField
                        label={t('fieldLabels.zipCode')}
                        error={errors.zipCode !== undefined}
                        helperText={
                          errors.zipCode !== undefined && errors.zipCode.message
                        }
                        onChange={onChange}
                        value={value}
                        onBlur={onBlur}
                      />
                    )}
                  />
                </InlineFormDisplayGroup>
              </>
            ) : null}
            <AutoCompleteCountry
              label={t('fieldLabels.country')}
              name="country"
              onChange={setCountry}
              defaultValue={
                getStoredConfig('loc').countryCode === 'T1' ||
                getStoredConfig('loc').countryCode === 'XX' ||
                getStoredConfig('loc').countryCode === ''
                  ? ''
                  : getStoredConfig('loc').countryCode
              }
            />
            <div className={styles.inlineToggleGroup}>
              <div>
                <label
                  htmlFor="is-public"
                  className={styles.mainText}
                  style={{ cursor: 'pointer' }}
                >
                  {t('fieldLabels.isPublic')}
                </label>{' '}
                <br />
                {isPublic && (
                  <label className={styles.isPrivateAccountText}>
                    {t('publicProfileExplanation')}
                  </label>
                )}
              </div>
              <Controller
                name="isPublic"
                control={control}
                defaultValue={false}
                render={({ field: { onChange, value } }) => (
                  <NewToggleSwitch
                    checked={value}
                    onChange={onChange}
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                    id="is-public"
                  />
                )}
              />
            </div>

            <div className={styles.inlineToggleGroup}>
              <div className={styles.mainText}>
                <label htmlFor="get-news" style={{ cursor: 'pointer' }}>
                  {t('fieldLabels.subscribe')}
                </label>
              </div>
              <Controller
                name="getNews"
                control={control}
                defaultValue={true}
                render={({ field: { onChange, value } }) => {
                  return (
                    <NewToggleSwitch
                      checked={value}
                      onChange={(e) => onChange(e.target.checked)}
                      inputProps={{ 'aria-label': 'secondary checkbox' }}
                      id="get-news"
                    />
                  );
                }}
              />
            </div>

            <div>
              <div className={styles.inlineToggleGroup}>
                <div className={styles.mainText}>
                  <label htmlFor={'terms'} style={{ cursor: 'pointer' }}>
                    {t.rich('termAndCondition', {
                      termsLink: (chunks) => (
                        <a
                          className="planet-links"
                          rel="noopener noreferrer"
                          href={`https://pp.eco/legal/${locale}/terms`}
                          target={'_blank'}
                        >
                          {chunks}
                        </a>
                      ),
                    })}
                  </label>
                </div>
                <NewToggleSwitch
                  checked={acceptTerms || false}
                  onChange={(e) => {
                    handleTermsAndCondition(e.target.checked);
                  }}
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                  id="terms"
                />
              </div>
              {!acceptTerms && typeof acceptTerms !== 'object' && (
                <div className={styles.termsError}>
                  {t('termAndConditionError')}
                </div>
              )}
            </div>
            <div className={styles.horizontalLine} />

            <button
              id={'signupCreate'}
              className={styles.saveButton}
              onClick={handleSubmit(createButtonClicked)}
              disabled={isProcessing}
            >
              {submit ? (
                <div className={styles.spinner}></div>
              ) : (
                t('createAccount')
              )}
            </button>
          </div>
        </div>
        {/* snackbar */}
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
      </div>
    );
  }
  return null;
}
