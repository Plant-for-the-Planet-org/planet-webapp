import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './CompleteSignup.module.scss';
import MaterialTextField from '../../common/InputTypes/MaterialTextField';
import ToggleSwitch from '../../common/InputTypes/ToggleSwitch';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import BackArrow from '../../../../public/assets/images/icons/headerIcons/BackArrow';
import AutoCompleteCountry from '../../common/InputTypes/AutoCompleteCountry';
import { getUserExistsInDB, setUserExistsInDB, removeUserExistsInDB, getLocalUserInfo, setLocalUserInfo, removeLocalUserInfo } from '../../../utils/auth0/localStorageUtils'
import COUNTRY_ADDRESS_POSTALS from '../../../utils/countryZipCode';
import { useForm, Controller } from 'react-hook-form';
import i18next from '../../../../i18n';
import { useAuth0 } from '@auth0/auth0-react';
import CancelIcon from '../../../../public/assets/images/icons/CancelIcon';
import { selectUserType } from '../../../utils/selectUserType';

const { useTranslation } = i18next;
export default function CompleteSignup() {

  const {
    isLoading,
    isAuthenticated,
    getAccessTokenSilently,
    logout,
    loginWithRedirect,
    user
  } = useAuth0();  

  const router = useRouter();
  const { t, ready } = useTranslation(['editProfile', 'donate']);

  const { register, handleSubmit, errors, control, reset, setValue, watch, getValues } = useForm({ mode: 'onBlur' });

  const isPrivate = watch('isPrivate');

  const [token, setToken] = React.useState('')

  React.useEffect(() => {
    async function loadFunction() {
      const token = await getAccessTokenSilently();
      setToken(token);
      if(!token){
        loginWithRedirect({redirectUri:`${process.env.NEXTAUTH_URL}/login`, ui_locales: localStorage.getItem('language') || 'en' });
      }
      const userExistsInDB = getUserExistsInDB();
      if (token && userExistsInDB) {
        if (getLocalUserInfo().slug) {
          const userSlug = getLocalUserInfo().slug;
          if (typeof window !== 'undefined') {
            router.push(`/t/${userSlug}`);
          }
        }
      }      
    }
    if (isAuthenticated && !isLoading) {
      loadFunction()
    }
  }, [isAuthenticated, isLoading])

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
  const defaultCountry = typeof window !== 'undefined' ? localStorage.getItem('countryCode') : 'DE';

  const [postalRegex, setPostalRegex] = React.useState(COUNTRY_ADDRESS_POSTALS.filter((item) => item.abbrev === country)[0]?.postal)
  React.useEffect(() => {
    const fiteredCountry = COUNTRY_ADDRESS_POSTALS.filter((item) => item.abbrev === country);
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
        setUserExistsInDB(true);
        const userInfo = getLocalUserInfo();
        const newUserInfo = { ...userInfo, slug: resJson.slug, type: resJson.type }
        setLocalUserInfo(newUserInfo)
        setSnackbarMessage(ready ? t('editProfile:profileCreated') : '');
        setSeverity("success")
        handleSnackbarOpen();

        if (typeof window !== 'undefined') {
          router.push(`/t/${resJson.slug}`);
        }
      } else if (res.status === 401) {
        // in case of 401 - invalid token: signIn()
        console.log('in 401-> unauthenticated user / invalid token')
        removeLocalUserInfo();
        logout({ returnTo: `${process.env.NEXTAUTH_URL}/` });

        removeUserExistsInDB()
        loginWithRedirect({redirectUri:`${process.env.NEXTAUTH_URL}/login`, ui_locales: localStorage.getItem('language') || 'en' });
      } else {
        setSnackbarMessage(ready ? t('editProfile:profileCreationFailed') : '');
        setSeverity("error")
        handleSnackbarOpen();
      }
    } catch {
      setSnackbarMessage(ready ? t('editProfile:profileCreationError') : '');
      setSeverity("error")
      handleSnackbarOpen();
    }
  };

  const profileTypes = [
    { id: 1, title: ready ? t('editProfile:individual') : '', value: 'individual' },
    { id: 2, title: ready ? t('editProfile:organization') : '', value: 'organization' },
    { id: 3, title: ready ? t('editProfile:tpo') : '', value: 'tpo' },
    { id: 4, title: ready ? t('editProfile:education') : '', value: 'education' }
  ]

  React.useEffect(() => {
    // This will remove field values which do not exist for the new type
    reset()
  }, [type])

  const createButtonClicked = async (data: any) => {
    if (!isLoading && token) {
      const submitData = {
        ...data,
        country,
        type,
        oAuthAccessToken: token
      }
      sendRequest(submitData)
    }
  };

  const logoutUser = () => {
    removeLocalUserInfo();
    logout({ returnTo: `${process.env.NEXTAUTH_URL}/` });
  }

  if (
    isLoading ||
    (!isLoading && token && (getUserExistsInDB() === true)) ||
    (!isLoading && !token)
  ) {
    return null;
  }
  if (!isLoading && token && (getUserExistsInDB() === false)) {
    return ready ? (
      <div
        className={styles.signUpPage}
        style={{
          backgroundImage: `url(${process.env.CDN_URL}/media/images/app/bg_layer.jpg)`,
        }}
      >
        <div className={requestSent ? styles.signupRequestSent : styles.signup}>
          {/* header */}
          <div className={styles.header}>
            <div
              onClick={logoutUser}
              className={styles.headerBackIcon}
            >
              <CancelIcon color={styles.primaryFontColor} />
            </div>
            <div className={styles.headerTitle}>{t('editProfile:signUpText')}</div>
          </div>

          {/* type of account buttons */}
          <div className={styles.profileTypesContainer}>
            {profileTypes.map(item => {
              return (
                <button id={'editProfileTypes'} key={item.id} className={`${styles.profileTypes} ${type === item.value ? styles.profileTypesSelected : ''}`} onClick={() => setAccountType(item.value)}>
                  {t('editProfile:profileTypes', {
                    item: item
                  })}
                </button>
              )
            })}
          </div>

          <div className={styles.formField}>
            <div className={styles.formFieldHalf}>
              <MaterialTextField
                label={t('donate:firstName')}
                variant="outlined"
                inputRef={register({ required: true })}
                name={"firstname"}
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
                name={"lastname"}
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
                  type: selectUserType(type, t)
                })}
                variant="outlined"
                inputRef={register({ required: true })}
                name={"name"}
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
              defaultValue={user.email}
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
                  name={"address"}
                />
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
                    name={"city"}
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
                      required: true
                    })}
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
              defaultValue={defaultCountry}
            />
            {errors.country && (
              <span className={styles.formErrors}>
                {t('donate:countryRequired')}
              </span>
            )}
          </div>

          <div className={styles.isPrivateAccountDiv}>
            <div>
              <div className={styles.mainText}>{t('editProfile:privateAccount')}</div>
              {isPrivate &&
                <div className={styles.isPrivateAccountText}>
                  <label htmlFor={'isPrivate'}>
                    {t('editProfile:privateAccountTxt')}
                  </label>
                </div>
              }
            </div>
            <Controller
              name="isPrivate"
              id="isPrivate"
              control={control}
              inputRef={register()}
              defaultValue={false}
              render={props => (
                <ToggleSwitch
                  checked={props.value}
                  onChange={e => props.onChange(e.target.checked)}
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
              )}
            />
          </div>

          <div className={styles.isPrivateAccountDiv}>
            <div className={styles.mainText}>
              <label htmlFor={'getNews'}>
                {t('editProfile:subscribe')}
              </label>
            </div>
            <Controller
              name="getNews"
              id="getNews"
              control={control}
              inputRef={register()}
              defaultValue={true}
              render={props => (
                <ToggleSwitch
                  checked={props.value}
                  onChange={e => props.onChange(e.target.checked)}
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
              )}
            />
          </div>

          <div className={styles.horizontalLine} />

          <button id={'signupCreate'} className={styles.saveButton} onClick={handleSubmit(createButtonClicked)}>
            {t('editProfile:createAccount')}
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