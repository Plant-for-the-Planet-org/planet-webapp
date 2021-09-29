import { MenuItem } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Controller, useForm } from 'react-hook-form';
import i18next from '../../../../i18n';
import Camera from '../../../../public/assets/images/icons/userProfileIcons/Camera';
import CameraWhite from '../../../../public/assets/images/icons/userProfileIcons/CameraWhite';
import { putAuthenticatedRequest } from '../../../utils/apiRequests/api';
import COUNTRY_ADDRESS_POSTALS from '../../../utils/countryZipCode';
import getImageUrl from '../../../utils/getImageURL';
import { selectUserType } from '../../../utils/selectUserType';
import AutoCompleteCountry from '../../common/InputTypes/AutoCompleteCountry';
import MaterialTextField from '../../common/InputTypes/MaterialTextField';
import ToggleSwitch from '../../common/InputTypes/ToggleSwitch';
import { UserPropsContext } from '../../common/Layout/UserPropsContext';
import styles from './EditProfile.module.scss';
import GeocoderArcGIS from "geocoder-arcgis";

const { useTranslation } = i18next;

interface Props {}

export default function EditProfile({}: Props) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const { user, setUser, token, contextLoaded } = React.useContext(
    UserPropsContext
  );

  const [isUploadingData, setIsUploadingData] = React.useState(false);
  const { t, ready } = useTranslation(['editProfile', 'donate']);

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

  React.useEffect(() => {
    const defaultProfileDetails = {
      firstname: user.firstname ? user.firstname : '',
      lastname: user.lastname ? user.lastname : '',
      address: user.address && user.address.address ? user.address.address : '',
      city: user.address && user.address.city ? user.address.city : '',
      zipCode: user.address && user.address.zipCode ? user.address.zipCode : '',
      country: user.address && user.address.country ? user.address.country : '',
      isPrivate: user.isPrivate ? user.isPrivate : false,
      getNews: user.getNews ? user.getNews : false,
      bio: user.bio ? user.bio : '',
      url: user.url ? user.url : '',
      name: user.name ? user.name : '',
    };
    reset(defaultProfileDetails);
  }, [user]);

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

  const [country, setCountry] = React.useState(user.country);
  const [updatingPic, setUpdatingPic] = React.useState(false);

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

  const [postalRegex, setPostalRegex] = React.useState(
    COUNTRY_ADDRESS_POSTALS.filter((item) => item.abbrev === country)[0]?.postal
  );
  React.useEffect(() => {
    const fiteredCountry = COUNTRY_ADDRESS_POSTALS.filter(
      (item) => item.abbrev === country
    );
    setPostalRegex(fiteredCountry[0]?.postal);
  }, [country]);

  // the form values
  const [severity, setSeverity] = useState('success');
  const [snackbarMessage, setSnackbarMessage] = useState('OK');
  const watchIsPrivate = watch('isPrivate');
  const [type, setAccountType] = useState('individual');


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
    {
      id: 3,
      title: ready ? t('editProfile:education') : '',
      value: 'education',
    },
  ];

  React.useEffect(() => {
    // This will remove field values which do not exist for the new type
    reset();
  }, [type]);
  const onDrop = React.useCallback(
    (acceptedFiles) => {
      setUpdatingPic(true);
      acceptedFiles.forEach((file: any) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onabort = () => console.log('file reading was aborted');
        reader.onerror = () => console.log('file reading has failed');
        reader.onload = async (event) => {
          if (contextLoaded && token) {
            const bodyToSend = {
              imageFile: event.target.result,
            };
            setSeverity('info');
            setSnackbarMessage(ready ? t('editProfile:profilePicUpdated') : '');
            handleSnackbarOpen();

            putAuthenticatedRequest(`/app/profile`, bodyToSend, token)
              .then((res) => {
                const newUserInfo = { ...user, image: res.image };
                setUpdatingPic(false);
                setUser(newUserInfo);
              })
              .catch((error) => {
                setUpdatingPic(false);
                console.log(error);
              });
          }
        };
      });
    },
    [token]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'image/*',
    multiple: false,
    onDrop: onDrop,
    onDropAccepted: () => {
      // console.log('uploaded');
    },
  });

  const saveProfile = async (data: any) => {
    setIsUploadingData(true);
    let bodyToSend = {
      ...data,
      country: country,
    };  
    if (type !== 'tpo') {
      bodyToSend = {
        ...bodyToSend,
        type: type,
      };
    }
    if (contextLoaded && token) {
      try {
        putAuthenticatedRequest(`/app/profile`, bodyToSend, token)
          .then((res) => {
            console.log(res);
            if (res.code !== 400) {
              setSeverity('success');
              setSnackbarMessage(ready ? t('editProfile:profileSaved') : '');
              handleSnackbarOpen();
              setIsUploadingData(false);
              setUser(res);
            } else {
              setSeverity('error');
              setSnackbarMessage(
                ready ? t('editProfile:profileSaveFailed') : ''
              );
              handleSnackbarOpen();
              setIsUploadingData(false);
            }
          })
          .catch((error) => {
            setSeverity('error');
            setSnackbarMessage(ready ? t('editProfile:profileSaveFailed') : '');
            handleSnackbarOpen();
            setIsUploadingData(false);
            console.log(error);
          });
      } catch (e) {
        setSeverity('error');
        setSnackbarMessage(ready ? t('editProfile:profileSaveFailed') : '');
        handleSnackbarOpen();
        setIsUploadingData(false);
      }
    }
  };
  let suggestion_counter = 0;

  return ready ? (
    <div className="profilePage">
       <div className={'profilePageTitle'}>
             {t('editProfile:edit')}
          </div>
      <div className={styles.editProfileContainer}>
         

        <div
          {...getRootProps()}
          style={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <label htmlFor="upload">
            <div className={styles.profilePicDiv}>
              <input {...getInputProps()} />
              {updatingPic ? (
                <div className={styles.spinnerImage}></div>
              ) : user.image ? (
                <div className={styles.profilePic}>
                  <img
                    src={getImageUrl('profile', 'thumb', user.image)}
                    className={styles.profilePicImg}
                  />
                  <div className={styles.profilePicOverlay} />
                  <CameraWhite />
                </div>
              ) : (
                <div className={styles.noProfilePic}>
                  <Camera />
                </div>
              )}
            </div>
          </label>
        </div>
        {type !== 'tpo' ? (
          <MaterialTextField
            label={t('editProfile:iamA')}
            variant="outlined"
            select
            defaultValue={type}
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
          </MaterialTextField>
        ) : null}
        <div className={styles.formField}>
          <div className={styles.formFieldHalf}>
            <MaterialTextField
              label={t('donate:firstName')}
              variant="outlined"
              name="firstname"
              inputRef={register({ required: true })}
            />
            {errors.firstname && (
              <span className={styles.formErrors}>
                {t('donate:firstNameRequired')}
              </span>
            )}
          </div>
          <div style={{ width: '20px' }}></div>
          <div className={styles.formFieldHalf}>
            <MaterialTextField
              label={t('donate:lastName')}
              variant="outlined"
              name="lastname"
              inputRef={register({ required: true })}
            />
            {errors.lastname && (
              <span className={styles.formErrors}>
                {t('donate:lastNameRequired')}
              </span>
            )}
          </div>
        </div>

        {type && type !== 'individual' && (
          <div className={styles.formFieldLarge}>
            <MaterialTextField
              label={t('editProfile:profileName', {
                type: selectUserType(type, t),
              })}
              variant="outlined"
              name="name"
              inputRef={register({ required: true })}
            />
            {errors.name && (
              <span className={styles.formErrors}>
                {t('editProfile:nameValidation')}
              </span>
            )}
          </div>
        )}

        <div className={styles.formFieldLarge}>
          <MaterialTextField
            label={t('donate:address')}
            variant="outlined"
            name="address"
            inputRef={register({ required: true })}
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
              name="city"
              inputRef={register({ required: true })}
            />
            {errors.city && (
              <span className={styles.formErrors}>
                {t('donate:cityRequired')}
              </span>
            )}
          </div>
          <div style={{ width: '20px' }}></div>
          <div className={styles.formFieldHalf}>
            <MaterialTextField
              label={t('donate:zipCode')}
              variant="outlined"
              name="zipCode"
              inputRef={register({
                pattern: postalRegex,
                required: true,
              })}
            />
            {errors.zipCode && (
              <span className={styles.formErrors}>
                {t('donate:zipCodeAlphaNumValidation')}
              </span>
            )}
          </div>
        </div>

        <div className={styles.formFieldLarge}>
          <AutoCompleteCountry
            inputRef={null}
            defaultValue={country}
            onChange={setCountry}
            label={t('donate:country')}
            name="editProfile"
          />
          {errors.editProfile && (
            <span className={styles.formErrors}>
              {t('donate:countryRequired')}
            </span>
          )}
        </div>

        <div className={styles.isPrivateAccountDiv}>
          <div>
            <label
              htmlFor="editPrivate"
              className={styles.mainText}
              style={{ cursor: 'pointer' }}
            >
              {t('editProfile:privateAccount')}
            </label>{' '}
            <br />
            {watchIsPrivate && (
              <label className={styles.isPrivateAccountText}>
                {t('editProfile:privateAccountTxt')}
              </label>
            )}
          </div>
          <Controller
            name="isPrivate"
            control={control}
            inputRef={register()}
            render={(props:any) => (
              <ToggleSwitch
                checked={props.value}
                onChange={(e) => props.onChange(e.target.checked)}
                inputProps={{ 'aria-label': 'secondary checkbox' }}
                id="editPrivate"
              />
            )}
          />
        </div>

        <div className={styles.isPrivateAccountDiv}>
          <label
            htmlFor="editGetNews"
            className={styles.mainText}
            style={{ cursor: 'pointer' }}
          >
            {t('editProfile:subscribe')}
          </label>

          <Controller
            name="getNews"
            control={control}
            inputRef={register()}
            render={(props:any) => (
              <ToggleSwitch
                checked={props.value}
                onChange={(e) => props.onChange(e.target.checked)}
                inputProps={{ 'aria-label': 'secondary checkbox' }}
                id="editGetNews"
              />
            )}
          />
        </div>

        <div className={styles.horizontalLine} />

        <div className={styles.formFieldLarge}>
          <MaterialTextField
            label={t('editProfile:profileDescription')}
            variant="outlined"
            multiline
            name="bio"
            inputRef={register({
              maxLength: 300,
            })}
          />
        </div>
        {errors.bio && (
          <span className={styles.formErrors}>
            {t('editProfile:descriptionRequired')}
          </span>
        )}

        <div className={styles.formFieldLarge}>
          <MaterialTextField
            label={t('editProfile:website')}
            variant="outlined"
            name="url"
            inputRef={register({
              pattern: {
                //value: /^(?:http(s)?:\/\/)?[\w\.\-]+(?:\.[\w\.\-]+)+[\w\.\-_~:/?#[\]@!\$&'\(\)\*\+,;=#%]+$/,
                value: /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=*]*)$/,
                message: t('editProfile:websiteError'),
              },
            })}
          />
        </div>
        {errors.url && (
          <span className={styles.formErrors}>
            {t('editProfile:websiteRequired')}
          </span>
        )}

        <div
          className={styles.formFieldLarge}
        >
          <button
            id={'editProfileSaveProfile'}
            className={styles.saveButton}
            onClick={handleSubmit(saveProfile)}
          >
            {isUploadingData ? (
              <div className={styles.spinner}></div>
            ) : (
              t('editProfile:save')
            )}
          </button>
        </div>
      </div>
      {/* snackbar for showing various messages */}
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
