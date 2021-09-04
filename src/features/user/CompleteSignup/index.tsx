import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from './CompleteSignup.module.scss';
import MaterialTextField from '../../common/InputTypes/MaterialTextField';
import ToggleSwitch from '../../common/InputTypes/ToggleSwitch';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import AutoCompleteCountry from '../../common/InputTypes/AutoCompleteCountry';
import COUNTRY_ADDRESS_POSTALS from '../../../utils/countryZipCode';
import { useForm, Controller } from 'react-hook-form';
import i18next from '../../../../i18n';
import CancelIcon from '../../../../public/assets/images/icons/CancelIcon';
import { selectUserType } from '../../../utils/selectUserType';
import { makeStyles, MenuItem } from '@material-ui/core';
import { getStoredConfig } from '../../../utils/storeConfig';
import { UserPropsContext } from '../../common/Layout/UserPropsContext';
import themeProperties from '../../../theme/themeProperties';
import { ThemeContext } from '../../../theme/themeContext';
import GeocoderArcGIS from "geocoder-arcgis";

const { useTranslation } = i18next;

export default function CompleteSignup() {
  const router = useRouter();
  const { t, ready } = useTranslation(['editProfile', 'donate']);
  const [addressSugggestions, setaddressSugggestions] = React.useState([]);
  const geocoder = new GeocoderArcGIS(process.env.ESRI_CLIENT_SECRET ? {
    client_id:process.env.ESRI_CLIENT_ID,
    client_secret:process.env.ESRI_CLIENT_SECRET,
  } : {});
  const suggestAddress = (value) => {
    if (value.length > 3) {
      geocoder
        .suggest(value, {category:"Address", countryCode: country}) 
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
      .findAddressCandidates(value, { outfields: "*" })
      .then((result) => {
        setValue("address", result.candidates[0].attributes.ShortLabel, {
          shouldValidate: true,
        });
        setValue("city", result.candidates[0].attributes.City, {
          shouldValidate: true,
        });
        setValue("zipCode", result.candidates[0].attributes.Postal, {
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
        theme === "theme-light"
          ? `${themeProperties.light.primaryFontColor} !important`
          : `${themeProperties.dark.primaryFontColor} !important`,
      backgroundColor:
        theme === "theme-light"
          ? `${themeProperties.light.backgroundColor} !important`
          : `${themeProperties.dark.backgroundColor} !important`,
    },
    option: {
      // color: '#2F3336',
      "&:hover": {
        backgroundColor:
          theme === "theme-light"
            ? `${themeProperties.light.backgroundColorDark} !important`
            : `${themeProperties.dark.backgroundColorDark} !important`,
      },
    }
  })
  const classes = useStylesAutoComplete();

  const {
    register,
    handleSubmit,
    errors,
    control,
    reset,
    setValue,
    watch,
    getValues,
  } = useForm({ mode: 'onBlur' });

  const {
    user,
    setUser,
    auth0User,
    loginWithRedirect,
    contextLoaded,
    logoutUser,
    token,
  } = React.useContext(UserPropsContext);

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
      const res = await fetch(`${process.env.API_ENDPOINT}/app/profile`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(bodyToSend),
      });
      setRequestSent(false);
      if (res.status === 200) {
        // successful signup -> goto me page
        const resJson = await res.json();
        setUser(resJson);
        setSnackbarMessage(ready ? t('editProfile:profileCreated') : '');
        setSeverity('success');
        handleSnackbarOpen();

        if (typeof window !== 'undefined') {
          router.push('/t/[id]', `/t/${resJson.slug}`);
        }
      } else if (res.status === 401) {
        // in case of 401 - invalid token: signIn()
        console.log('in 401-> unauthenticated user / invalid token');
        setUser(false);
        setSubmit(false);
        logoutUser();
        loginWithRedirect({
          redirectUri: `${process.env.NEXTAUTH_URL}/login`,
          ui_locales: localStorage.getItem('language') || 'en',
        });
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
        className={styles.signUpPage}
        style={{
          backgroundImage: `url(${process.env.CDN_URL}/media/images/app/bg_layer.jpg)`,
        }}
      >
        <div className={requestSent ? styles.signupRequestSent : styles.signup} 
        style={{
          backgroundColor: theme === 'theme-light' ?
                          themeProperties.light.light :
                          themeProperties.dark.backgroundColor,
          color: theme === 'theme-light' ?
                 themeProperties.light.primaryFontColor :
                 themeProperties.dark.primaryFontColor,
        }}>
          {/* header */}
          <div className={styles.header}>
            <div onClick={() => logoutUser()} className={styles.headerBackIcon}>
              <CancelIcon color={styles.primaryFontColor} />
            </div>
            <div className={styles.headerTitle}>
              {t('editProfile:signUpText')}
            </div>
          </div>

          {/* type of account buttons */}
          <MaterialTextField
            label={t('editProfile:iamA')}
            variant="outlined"
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
          </MaterialTextField>

          <div className={styles.formField}>
            <div className={styles.formFieldHalf}>
              <MaterialTextField
                label={t('donate:firstName')}
                variant="outlined"
                inputRef={register({ required: true })}
                name={'firstname'}
                defaultValue={auth0User.given_name ? auth0User.given_name : ''}
              />
              {errors.firstname && (
                <span className={styles.formErrors}>
                  {t('donate:firstNameRequired')}
                </span>
              )}
            </div>

            <div className={styles.formFieldHalf}>
              <MaterialTextField
                label={t('donate:lastName')}
                variant="outlined"
                inputRef={register({ required: true })}
                name={'lastname'}
                defaultValue={
                  auth0User.family_name ? auth0User.family_name : ''
                }
              />
              {errors.lastname && (
                <span className={styles.formErrors}>
                  {t('donate:lastNameRequired')}
                </span>
              )}
            </div>
          </div>

          {type !== 'individual' ? (
            <div className={styles.formFieldLarge}>
              <MaterialTextField
                label={t('editProfile:profileName', {
                  type: selectUserType(type, t),
                })}
                variant="outlined"
                inputRef={register({ required: true })}
                name={'name'}
              />
              {errors.name && (
                <span className={styles.formErrors}>
                  {t('editProfile:nameValidation')}
                </span>
              )}
            </div>
          ) : null}

          <div className={styles.formFieldLarge}>
            <MaterialTextField
              defaultValue={auth0User.email}
              label={t('donate:email')}
              variant="outlined"
              disabled
            />
          </div>

          {type === 'tpo' ? (
            <>
              <div className={styles.formFieldLarge}>
                <MaterialTextField
                  label={t('donate:address')}
                  variant="outlined"
                  inputRef={register({ required: true })}
                  name={'address'}
                  onChange={(event) => {
                    suggestAddress(event.target.value);
                  }}
                  onBlur={() => setaddressSugggestions([])}
                />
                {addressSugggestions
              ? addressSugggestions.length > 0 && (
                  <div className="suggestions-container">
                    {addressSugggestions.map((suggestion) => {
                      return (
                        <div key={'suggestion' + suggestion_counter++}
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
                {errors.address && (
                  <span className={styles.formErrors}>
                    {t('donate:addressRequired')}
                  </span>
                )}
              </div>

              <div className={styles.formField}>
                <div className={styles.formFieldHalf}>
                  <MaterialTextField
                    label={t('donate:city')}
                    variant="outlined"
                    inputRef={register({ required: true })}
                    defaultValue={
                      getStoredConfig('loc').city === 'T1' ||
                      getStoredConfig('loc').city === 'XX' ||
                      getStoredConfig('loc').city === ''
                        ? ''
                        : getStoredConfig('loc').city
                    }
                    name={'city'}
                  />
                  {errors.city && (
                    <span className={styles.formErrors}>
                      {t('donate:cityRequired')}
                    </span>
                  )}
                </div>
                <div className={styles.formFieldHalf}>
                  <MaterialTextField
                    label={t('donate:zipCode')}
                    variant="outlined"
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
                  />
                  {errors.zipCode && (
                    <span className={styles.formErrors}>
                      {t('donate:zipCodeAlphaNumValidation')}
                    </span>
                  )}
                </div>
              </div>
            </>
          ) : null}

          <div className={styles.formFieldLarge}>
            <AutoCompleteCountry
              inputRef={null}
              label={t('donate:country')}
              name="country"
              onChange={(country) => setCountry(country)}
              defaultValue={
                getStoredConfig('loc').countryCode === 'T1' ||
                getStoredConfig('loc').countryCode === 'XX' ||
                getStoredConfig('loc').countryCode === ''
                  ? ''
                  : getStoredConfig('loc').countryCode
              }
            />
            {errors.country && (
              <span className={styles.formErrors}>
                {t('donate:countryRequired')}
              </span>
            )}
          </div>

          <div className={styles.isPrivateAccountDiv}>
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
              render={(props) => (
                <ToggleSwitch
                  checked={props.value}
                  onChange={(e) => props.onChange(e.target.checked)}
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                  id="isPrivate"
                />
              )}
            />
          </div>

          <div className={styles.isPrivateAccountDiv}>
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
              render={(props) => (
                <ToggleSwitch
                  checked={props.value}
                  onChange={(e) => props.onChange(e.target.checked)}
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                  id="getNews"
                />
              )}
            />
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
        {/* snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={handleSnackbarClose}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={handleSnackbarClose}
            severity={severity}
          >
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>
      </div>
    ) : null;
  }
  return null;
}
