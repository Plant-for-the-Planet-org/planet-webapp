import React, { ReactElement, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../../../../src/features/user/CompleteSignup/CompleteSignup.module.scss';
import ToggleSwitch from '../../common/InputTypes/ToggleSwitch';
import {
  Snackbar,
  Alert as MuiAlert,
  MenuItem,
  styled,
  TextField,
  AlertColor,
} from '@mui/material';
import AutoCompleteCountry from '../../common/InputTypes/AutoCompleteCountry';
import COUNTRY_ADDRESS_POSTALS from '../../../utils/countryZipCode';
import { useForm, Controller } from 'react-hook-form';
import CancelIcon from '../../../../public/assets/images/icons/CancelIcon';
import { selectUserType } from '../../../utils/selectUserType';
import { getStoredConfig } from '../../../utils/storeConfig';
import { useUserProps } from '../../common/Layout/UserPropsContext';
import themeProperties from '../../../theme/themeProperties';
import { ThemeContext } from '../../../theme/themeContext';
import GeocoderArcGIS from 'geocoder-arcgis';
import { postRequest } from '../../../utils/apiRequests/api';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import { useLocale, useTranslations } from 'next-intl';
import InlineFormDisplayGroup from '../../common/Layout/Forms/InlineFormDisplayGroup';
import {
  handleError,
  APIError,
  User,
  UserType,
  CreateUserRequest,
  CountryCode,
} from '@planet-sdk/common';
import {
  AddressSuggestionsType,
  AddressType,
} from '../../common/types/geocoder';
import { ExtendedCountryCode } from '../../common/types/country';
import { useTenant } from '../../common/Layout/TenantContext';

const Alert = styled(MuiAlert)(({ theme }) => {
  return {
    backgroundColor: theme.palette.primary.main,
  };
});

const MuiTextField = styled(TextField)(() => {
  return {
    width: '100%',
  };
});

type FormData = Omit<
  CreateUserRequest,
  'type' | 'country' | 'oAuthAccessToken'
>;

export default function CompleteSignup(): ReactElement | null {
  const router = useRouter();
  const t = useTranslations('EditProfile');
  const locale = useLocale();
  const { setErrors, redirect } = React.useContext(ErrorHandlingContext);
  const [addressSugggestions, setaddressSugggestions] = React.useState<
    AddressSuggestionsType[]
  >([]);
  const [isProcessing, setIsProcessing] = React.useState<boolean>(false);
  const [country, setCountry] = useState<ExtendedCountryCode | ''>('');
  const { tenantConfig } = useTenant();

  const geocoder = new GeocoderArcGIS(
    process.env.ESRI_CLIENT_SECRET
      ? {
          client_id: process.env.ESRI_CLIENT_ID,
          client_secret: process.env.ESRI_CLIENT_SECRET,
        }
      : {}
  );

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({ mode: 'onBlur' });

  const suggestAddress = (value: string) => {
    if (value.length > 3) {
      geocoder
        .suggest(value, { category: 'Address', countryCode: country })
        .then((result: { suggestions: AddressSuggestionsType[] }) => {
          const filterdSuggestions = result.suggestions.filter((suggestion) => {
            return !suggestion.isCollection;
          });
          setaddressSugggestions(filterdSuggestions);
        })
        .catch(console.log);
    }
  };
  const getAddress = (value: string) => {
    geocoder
      .findAddressCandidates(value, { outfields: '*' })
      .then((result: AddressType) => {
        setValue('address', result.candidates[0].attributes.ShortLabel, {
          shouldValidate: true,
        });
        setValue('city', result.candidates[0].attributes.City, {
          shouldValidate: true,
        });
        setValue('zipCode', result.candidates[0].attributes.Postal, {
          shouldValidate: true,
        });
        setaddressSugggestions([]);
      })
      .catch(console.log);
  };
  let suggestion_counter = 0;
  const { theme } = React.useContext(ThemeContext);

  const { user, setUser, auth0User, contextLoaded, logoutUser, token } =
    useUserProps();

  const isPublic = watch('isPublic');
  const [submit, setSubmit] = React.useState(false);
  React.useEffect(() => {
    async function loadFunction() {
      if (token) {
        if (user && user.slug) {
          if (typeof window !== 'undefined') {
            router.push('/profile');
          }
        }
      } else {
        router.push('/');
      }
    }
    if (contextLoaded) {
      loadFunction();
    }
  }, [contextLoaded, user, token]);

  //  snackbars (for warnings, success messages, errors)
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const handleSnackbarOpen = () => {
    setSnackbarOpen(true);
  };
  const handleSnackbarClose = (
    event?: React.SyntheticEvent,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const [type, setAccountType] = useState<UserType>('individual');
  const [snackbarMessage, setSnackbarMessage] = useState('OK');
  const [severity, setSeverity] = useState<AlertColor>('info');
  const [requestSent, setRequestSent] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState<boolean | null>(null);

  const [postalRegex, setPostalRegex] = React.useState(
    COUNTRY_ADDRESS_POSTALS.filter((item) => item.abbrev === country)[0]?.postal
  );
  React.useEffect(() => {
    const fiteredCountry = COUNTRY_ADDRESS_POSTALS.filter(
      (item) => item.abbrev === country
    );
    setPostalRegex(fiteredCountry[0]?.postal);
  }, [country]);

  const sendRequest = async (bodyToSend: CreateUserRequest) => {
    setRequestSent(true);
    setIsProcessing(true);
    try {
      const res = await postRequest<User>(
        tenantConfig?.id,
        `/app/profile`,
        bodyToSend
      );
      setRequestSent(false);
      // successful signup -> goto me page
      setUser(res);
      setSnackbarMessage(t('profileCreated'));
      setSeverity('success');
      handleSnackbarOpen();

      if (typeof window !== 'undefined') {
        router.push('/t/[id]', `/t/${res.slug}`);
      }
    } catch (err) {
      setIsProcessing(false);
      setErrors(handleError(err as APIError));
      redirect('/login');
    }
  };

  const handleTermsAndCondition = (value: boolean) => {
    setAcceptTerms(value);
    if (!value) {
      setSubmit(false);
    }
  };
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

  React.useEffect(() => {
    // This will remove field values which do not exist for the new type
    reset();
  }, [type]);

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
                  ? themeProperties.light.light
                  : themeProperties.dark.backgroundColor,
              color:
                theme === 'theme-light'
                  ? themeProperties.light.primaryFontColor
                  : themeProperties.dark.primaryFontColor,
            }}
          >
            {/* header */}
            <div className={styles.header}>
              <div
                onClick={() => logoutUser(`${window.location.origin}/`)}
                className={styles.headerBackIcon}
              >
                <CancelIcon color={styles.primaryFontColor} />
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
                        suggestAddress(event.target.value);
                        onChange(event.target.value);
                      }}
                      onBlur={() => {
                        setaddressSugggestions([]);
                        onBlur();
                      }}
                      value={value}
                    />
                  )}
                />

                {addressSugggestions
                  ? addressSugggestions.length > 0 && (
                      <div className="suggestions-container">
                        {addressSugggestions.map((suggestion) => {
                          return (
                            <div
                              key={'suggestion' + suggestion_counter++}
                              onMouseDown={() => {
                                getAddress(suggestion.text);
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
                  <ToggleSwitch
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
                    <ToggleSwitch
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
                          className={styles.termsLink}
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
                <ToggleSwitch
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
              severity={severity}
            >
              {snackbarMessage}
            </Alert>
          </div>
        </Snackbar>
      </div>
    );
  }
  return null;
}
