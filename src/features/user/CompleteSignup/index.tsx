import React, { ReactElement, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../../../../src/features/user/CompleteSignup';
import ToggleSwitch from '../../common/InputTypes/ToggleSwitch';
import {
  Snackbar,
  Alert as MuiAlert,
  MenuItem,
  styled,
  TextField,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import AutoCompleteCountry from '../../common/InputTypes/AutoCompleteCountryNew';
import COUNTRY_ADDRESS_POSTALS from '../../../utils/countryZipCode';
import { useForm, Controller } from 'react-hook-form';
import CancelIcon from '../../../../public/assets/images/icons/CancelIcon';
import { selectUserType } from '../../../utils/selectUserType';
import { getStoredConfig } from '../../../utils/storeConfig';
import { UserPropsContext } from '../../common/Layout/UserPropsContext';
import themeProperties from '../../../theme/themeProperties';
import { ThemeContext } from '../../../theme/themeContext';
import GeocoderArcGIS from 'geocoder-arcgis';
import { postRequest } from '../../../utils/apiRequests/api';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import { useTranslation, Trans } from 'next-i18next';
import InlineFormDisplayGroup from '../../common/Layout/Forms/InlineFormDisplayGroup';

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

export default function CompleteSignup(): ReactElement | null {
  const router = useRouter();
  const { i18n, t, ready } = useTranslation(['editProfile', 'donate']);
  const { handleError } = React.useContext(ErrorHandlingContext);
  const [addressSugggestions, setaddressSugggestions] = React.useState([]);
  const geocoder = new GeocoderArcGIS(
    process.env.ESRI_CLIENT_SECRET
      ? {
          client_id: process.env.ESRI_CLIENT_ID,
          client_secret: process.env.ESRI_CLIENT_SECRET,
        }
      : {}
  );
  const suggestAddress = (value) => {
    if (value.length > 3) {
      geocoder
        .suggest(value, { category: 'Address', countryCode: country })
        .then((result) => {
          const filterdSuggestions = result.suggestions.filter((suggestion) => {
            return !suggestion.isCollection;
          });
          setaddressSugggestions(filterdSuggestions);
        })
        .catch(console.log);
    }
  };
  const getAddress = (value) => {
    geocoder
      .findAddressCandidates(value, { outfields: '*' })
      .then((result) => {
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
  const useStylesAutoComplete = makeStyles({
    root: {
      color:
        theme === 'theme-light'
          ? `${themeProperties.light.primaryFontColor} !important`
          : `${themeProperties.dark.primaryFontColor} !important`,
      backgroundColor:
        theme === 'theme-light'
          ? `${themeProperties.light.backgroundColor} !important`
          : `${themeProperties.dark.backgroundColor} !important`,
    },
    option: {
      // color: '#2F3336',
      '&:hover': {
        backgroundColor:
          theme === 'theme-light'
            ? `${themeProperties.light.backgroundColorDark} !important`
            : `${themeProperties.dark.backgroundColorDark} !important`,
      },
    },
  });
  const classes = useStylesAutoComplete();

  const { register, handleSubmit, errors, control, reset, setValue, watch } =
    useForm({ mode: 'onBlur' });

  const { user, setUser, auth0User, contextLoaded, logoutUser, token } =
    React.useContext(UserPropsContext);

  const isPrivate = watch('isPrivate');
  const [submit, setSubmit] = React.useState(false);
  React.useEffect(() => {
    async function loadFunction() {
      if (token) {
        if (user && user.slug) {
          if (typeof window !== 'undefined') {
            router.push(`/t/${user.slug}`);
          }
        }
      } else {
        router.push('/', undefined, { shallow: true });
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

  const [type, setAccountType] = useState('individual');
  const [snackbarMessage, setSnackbarMessage] = useState('OK');
  const [severity, setSeverity] = useState('info');
  const [requestSent, setRequestSent] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(null);
  const [country, setCountry] = useState('');
  const defaultCountry =
    typeof window !== 'undefined' ? localStorage.getItem('countryCode') : 'DE';

  const [postalRegex, setPostalRegex] = React.useState(
    COUNTRY_ADDRESS_POSTALS.filter((item) => item.abbrev === country)[0]?.postal
  );
  React.useEffect(() => {
    const fiteredCountry = COUNTRY_ADDRESS_POSTALS.filter(
      (item) => item.abbrev === country
    );
    setPostalRegex(fiteredCountry[0]?.postal);
  }, [country]);

  const sendRequest = async (bodyToSend: any) => {
    setRequestSent(true);
    try {
      const res = await postRequest(
        `/app/profile`,
        bodyToSend,
        handleError,
        '/login'
      );
      setRequestSent(false);
      if (res) {
        // successful signup -> goto me page
        setUser(res);
        setSnackbarMessage(ready ? t('editProfile:profileCreated') : '');
        setSeverity('success');
        handleSnackbarOpen();

        if (typeof window !== 'undefined') {
          router.push('/t/[id]', `/t/${res.slug}`);
        }
      } else {
        setSnackbarMessage(ready ? t('editProfile:profileCreationFailed') : '');
        setSubmit(false);
        setSeverity('error');
        handleSnackbarOpen();
      }
    } catch {
      setSubmit(false);
      setSnackbarMessage(ready ? t('editProfile:profileCreationError') : '');
      setSeverity('error');
      handleSnackbarOpen();
    }
  };

  const handleTermsAndCondition = (value) => {
    setAcceptTerms(value);
    if (!value) {
      setSubmit(false);
    }
  };
  const profileTypes = [
    {
      id: 1,
      title: ready ? t('editProfile:individual') : '',
      value: 'individual',
    },
    {
      id: 2,
      title: ready ? t('editProfile:organization') : '',
      value: 'organization',
    },
    { id: 3, title: ready ? t('editProfile:tpo') : '', value: 'tpo' },
    {
      id: 4,
      title: ready ? t('editProfile:education') : '',
      value: 'education',
    },
  ];

  React.useEffect(() => {
    // This will remove field values which do not exist for the new type
    reset();
  }, [type]);

  const createButtonClicked = async (data: any) => {
    if (!acceptTerms) {
      handleTermsAndCondition(false);
      return;
    }
    setSubmit(true);
    if (contextLoaded && token) {
      const submitData = {
        ...data,
        country,
        type,
        oAuthAccessToken: token,
      };
      sendRequest(submitData);
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
    return ready ? (
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
                onClick={() => logoutUser(`${process.env.NEXTAUTH_URL}/`)}
                className={styles.headerBackIcon}
              >
                <CancelIcon color={styles.primaryFontColor} />
              </div>
              <div className={styles.headerTitle}>
                {t('editProfile:signUpText')}
              </div>
            </div>

            {/* type of account buttons */}
            <MuiTextField
              label={t('editProfile:iamA')}
              select
              defaultValue={profileTypes[0].value}
            >
              {profileTypes.map((option) => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                  onClick={() => setAccountType(option.value)}
                  classes={{
                    // option: classes.option,
                    root: classes.root,
                  }}
                >
                  {option.title}
                </MenuItem>
              ))}
            </MuiTextField>

            <InlineFormDisplayGroup>
              <MuiTextField
                label={t('donate:firstName')}
                inputRef={register({ required: true })}
                name={'firstname'}
                defaultValue={auth0User.given_name ? auth0User.given_name : ''}
                error={errors.firstname}
                helperText={errors.firstname && t('donate:firstNameRequired')}
              />
              <MuiTextField
                label={t('donate:lastName')}
                inputRef={register({ required: true })}
                name={'lastname'}
                defaultValue={
                  auth0User.family_name ? auth0User.family_name : ''
                }
                error={errors.lastname}
                helperText={errors.lastname && t('donate:firstNameRequired')}
              />
            </InlineFormDisplayGroup>

            {type !== 'individual' ? (
              <MuiTextField
                label={t('editProfile:profileName', {
                  type: selectUserType(type, t),
                })}
                inputRef={register({ required: true })}
                name={'name'}
                error={errors.name}
                helperText={errors.name && t('editProfile:nameValidation')}
              />
            ) : null}

            <MuiTextField
              defaultValue={auth0User.email}
              label={t('donate:email')}
              disabled
            />

            {type === 'tpo' ? (
              <>
                <MuiTextField
                  label={t('donate:address')}
                  inputRef={register({ required: true })}
                  name={'address'}
                  onChange={(event) => {
                    suggestAddress(event.target.value);
                  }}
                  onBlur={() => setaddressSugggestions([])}
                  error={errors.address}
                  helperText={errors.address && t('donate:addressRequired')}
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
                  <MuiTextField
                    label={t('donate:city')}
                    inputRef={register({ required: true })}
                    defaultValue={
                      getStoredConfig('loc').city === 'T1' ||
                      getStoredConfig('loc').city === 'XX' ||
                      getStoredConfig('loc').city === ''
                        ? ''
                        : getStoredConfig('loc').city
                    }
                    name={'city'}
                    error={errors.city}
                    helperText={errors.city && t('donate:cityRequired')}
                  />
                  <MuiTextField
                    label={t('donate:zipCode')}
                    name="zipCode"
                    inputRef={register({
                      pattern: postalRegex,
                      required: true,
                    })}
                    defaultValue={
                      getStoredConfig('loc').postalCode === 'T1' ||
                      getStoredConfig('loc').postalCode === 'XX' ||
                      getStoredConfig('loc').postalCode === ''
                        ? ''
                        : getStoredConfig('loc').postalCode
                    }
                    error={errors.zipCode}
                    helperText={
                      errors.zipCode && t('donate:zipCodeAlphaNumValidation')
                    }
                  />
                </InlineFormDisplayGroup>
              </>
            ) : null}
            <AutoCompleteCountry
              label={t('donate:country')}
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
                  htmlFor="isPrivate"
                  className={styles.mainText}
                  style={{ cursor: 'pointer' }}
                >
                  {t('editProfile:privateAccount')}
                </label>{' '}
                <br />
                {isPrivate && (
                  <label className={styles.isPrivateAccountText}>
                    {t('editProfile:privateAccountTxt')}
                  </label>
                )}
              </div>
              <Controller
                name="isPrivate"
                id="isPrivate"
                control={control}
                inputRef={register()}
                defaultValue={false}
                render={(props: any) => (
                  <ToggleSwitch
                    checked={props.value}
                    onChange={(e: any) => props.onChange(e.target.checked)}
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                    id="isPrivate"
                  />
                )}
              />
            </div>

            <div className={styles.inlineToggleGroup}>
              <div className={styles.mainText}>
                <label htmlFor={'getNews'} style={{ cursor: 'pointer' }}>
                  {t('editProfile:subscribe')}
                </label>
              </div>
              <Controller
                name="getNews"
                id="getNews"
                control={control}
                inputRef={register()}
                defaultValue={true}
                render={(props: any) => {
                  return (
                    <ToggleSwitch
                      checked={props.value}
                      onChange={(e: any) => props.onChange(e.target.checked)}
                      inputProps={{ 'aria-label': 'secondary checkbox' }}
                      id="getNews"
                    />
                  );
                }}
              />
            </div>

            <div>
              <div className={styles.inlineToggleGroup}>
                <div className={styles.mainText}>
                  <label htmlFor={'terms'} style={{ cursor: 'pointer' }}>
                    <Trans i18nKey="editProfile:termAndCondition">
                      <a
                        className={styles.termsLink}
                        rel="noopener noreferrer"
                        href={`https://pp.eco/legal/${i18n.language}/terms`}
                        target={'_blank'}
                      >
                        Terms and Conditions
                      </a>{' '}
                      of the Plant-for-the-Planet platform.
                    </Trans>
                  </label>
                </div>
                <ToggleSwitch
                  checked={acceptTerms}
                  onChange={(e: any) => {
                    handleTermsAndCondition(e.target.checked);
                  }}
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                  id="terms"
                />
              </div>
              {!acceptTerms && typeof acceptTerms !== 'object' && (
                <div className={styles.termsError}>
                  {t('editProfile:termAndConditionError')}
                </div>
              )}
            </div>
            <div className={styles.horizontalLine} />

            <button
              id={'signupCreate'}
              className={styles.saveButton}
              onClick={handleSubmit(createButtonClicked)}
            >
              {submit ? (
                <div className={styles.spinner}></div>
              ) : (
                t('editProfile:createAccount')
              )}
            </button>
          </div>
        </div>
        {/* snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={handleSnackbarClose}
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
    ) : null;
  }
  return null;
}
