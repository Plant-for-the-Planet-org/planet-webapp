import { Button, styled, TextField } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Controller, useForm } from 'react-hook-form';
import Camera from '../../../../../public/assets/images/icons/userProfileIcons/Camera';
import CameraWhite from '../../../../../public/assets/images/icons/userProfileIcons/CameraWhite';
import { putAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import COUNTRY_ADDRESS_POSTALS from '../../../../utils/countryZipCode';
import getImageUrl from '../../../../utils/getImageURL';
import { selectUserType } from '../../../../utils/selectUserType';
import AutoCompleteCountry from '../../../common/InputTypes/AutoCompleteCountryNew';
import ToggleSwitch from '../../../common/InputTypes/ToggleSwitch';
import { UserPropsContext } from '../../../common/Layout/UserPropsContext';
import styles from './EditProfile.module.scss';
import GeocoderArcGIS from 'geocoder-arcgis';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import { useTranslation } from 'next-i18next';
import { allCountries } from '../../../../utils/constants/countries';
import InlineFormDisplayGroup from '../../../common/Layout/Forms/InlineFormDisplayGroup';
import {
  MuiAutoComplete,
  StyledAutoCompleteOption,
} from '../../../common/InputTypes/MuiAutoComplete';
import StyledForm from '../../../common/Layout/StyledForm';
import { AddressSuggestionsType } from '../../../common/types/user';
import { AlertColor } from '@mui/lab';
import { APIError, handleError } from '@planet-sdk/common';

const Alert = styled(MuiAlert)(({ theme }) => {
  return {
    backgroundColor: theme.palette.primary.main,
  };
});

type FormData = {
  address: string;
  bio: string;
  city: string;
  firstname: string;
  getNews: boolean;
  isPrivate: boolean;
  lastname: string;
  name: string;
  url: string;
  zipCode: string;
};

export default function EditProfileForm() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { setErrors } = React.useContext(ErrorHandlingContext);
  const { user, setUser, token, contextLoaded, logoutUser } =
    React.useContext(UserPropsContext);

  const [isUploadingData, setIsUploadingData] = React.useState(false);
  const { t, ready } = useTranslation(['editProfile', 'donate']);

  const { register, handleSubmit, errors, control, reset, setValue, watch } =
    useForm({ mode: 'onBlur' });

  const handleSnackbarOpen = () => {
    setSnackbarOpen(true);
  };
  const handleSnackbarClose = (
    event?: React.SyntheticEvent<any> | Event,
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
      email: user.email ? user.email : '',
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

  const [country, setCountry] = React.useState(user.country);
  const [updatingPic, setUpdatingPic] = React.useState(false);

  const [addressSugggestions, setaddressSugggestions] = React.useState<
    AddressSuggestionsType[]
  >([]);
  const geocoder = new GeocoderArcGIS(
    process.env.ESRI_CLIENT_SECRET
      ? {
          client_id: process.env.ESRI_CLIENT_ID,
          client_secret: process.env.ESRI_CLIENT_SECRET,
        }
      : {}
  );
  const suggestAddress = (value: string) => {
    if (value.length > 3) {
      geocoder
        .suggest(value, { category: 'Address', countryCode: country })
        .then((result: { suggestions: AddressSuggestionsType[] }) => {
          const filterdSuggestions = result.suggestions.filter(
            (suggestion: AddressSuggestionsType) => {
              return !suggestion.isCollection;
            }
          );
          setaddressSugggestions(filterdSuggestions);
        })
        .catch(console.log);
    }
  };
  const getAddress = (value: string) => {
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
  const [severity, setSeverity] = useState<AlertColor>('success');
  const [snackbarMessage, setSnackbarMessage] = useState('OK');
  const watchIsPrivate = watch('isPrivate');
  const [type, setAccountType] = useState(user.type ? user.type : 'individual');
  const [localProfileType, setLocalProfileType] = useState({
    id: 1,
    title: ready ? t('editProfile:individual') : '',
    value: 'individual',
  });

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
    const selectedProfile = profileTypes.find((p) => p.value === type);
    selectedProfile &&
      setLocalProfileType({
        id: selectedProfile.id,
        title: selectedProfile.title,
        value: selectedProfile.value,
      });
  }, []);

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

            try {
              const res = await putAuthenticatedRequest(
                `/app/profile`,
                bodyToSend,
                token,
                logoutUser
              );
              const newUserInfo = { ...user, image: res.image };
              setUpdatingPic(false);
              setUser(newUserInfo);
            } catch (err) {
              setUpdatingPic(false);
              setErrors(handleError(err as APIError));
            }
          }
        };
      });
    },
    [token]
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    multiple: false,
    onDrop: onDrop,
    onDropAccepted: () => {},
  });

  const saveProfile = async (data: FormData) => {
    setIsUploadingData(true);
    const bodyToSend = {
      ...data,
      country: country,
      ...(type !== 'tpo' ? { type: type } : {}),
    };
    if (contextLoaded && token) {
      try {
        const res = await putAuthenticatedRequest(
          `/app/profile`,
          bodyToSend,
          token,
          logoutUser
        );
        setSeverity('success');
        setSnackbarMessage(ready ? t('editProfile:profileSaved') : '');
        handleSnackbarOpen();
        setIsUploadingData(false);
        setUser(res);
      } catch (err) {
        setIsUploadingData(false);
        setErrors(handleError(err as APIError));
      }
    }
  };
  let suggestion_counter = 0;

  return ready ? (
    <StyledForm>
      <div className="inputContainer">
        <div {...getRootProps()}>
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
          <MuiAutoComplete
            id="profile-type"
            value={localProfileType}
            options={profileTypes}
            getOptionLabel={(option) => option.title}
            isOptionEqualToValue={(option, selectedOption) =>
              option.value === selectedOption.value
            }
            renderOption={(props, option) => (
              <StyledAutoCompleteOption {...props} key={option.id}>
                {option.title}
              </StyledAutoCompleteOption>
            )}
            onChange={(event, newType) => {
              if (newType) {
                setAccountType(newType.value);
                setLocalProfileType(newType);
              }
            }}
            renderInput={(params) => (
              <TextField {...params} label={t('editProfile:iamA')} />
            )}
          />
        ) : null}
        <div className={styles.formField}>
          <div className={styles.formFieldHalf}>
            <TextField
              label={t('donate:firstName')}
              variant="outlined"
              name="firstname"
              inputRef={register({ required: true })}
            ></TextField>
            {errors.firstname && (
              <span className={styles.formErrors}>
                {t('donate:firstNameRequired')}
              </span>
            )}
          </div>
          <div className={styles.formFieldHalf}>
            <TextField
              label={t('donate:lastName')}
              variant="outlined"
              name="lastname"
              inputRef={register({ required: true })}
            ></TextField>
            {errors.lastname && (
              <span className={styles.formErrors}>
                {t('donate:lastNameRequired')}
              </span>
            )}
          </div>
        </div>

        <div className={styles.formFieldLarge}>
          <div style={{ width: '100%' }}>
            <TextField
              label={t('donate:email')}
              variant="outlined"
              name="email"
              defaultValue={user.email}
              disabled
            ></TextField>
          </div>
        </div>

        {type && type !== 'individual' && (
          <div className={styles.formFieldLarge}>
            <TextField
              label={t('editProfile:profileName', {
                type: selectUserType(type, t),
              })}
              variant="outlined"
              name="name"
              inputRef={register({ required: true })}
            ></TextField>
            {errors.name && (
              <span className={styles.formErrors}>
                {t('editProfile:nameValidation')}
              </span>
            )}
          </div>
        )}

        <div className={styles.formFieldLarge}>
          <TextField
            label={t('donate:address')}
            variant="outlined"
            name="address"
            inputRef={register({ required: true })}
            onChange={(event) => {
              suggestAddress(event.target.value);
            }}
            onBlur={() => setaddressSugggestions([])}
          ></TextField>
          {addressSugggestions
            ? addressSugggestions.length > 0 && (
                <div className="suggestions-container">
                  {addressSugggestions.map((suggestion) => {
                    return (
                      <div
                        key={'suggestion' + suggestion_counter++}
                        onMouseDown={() => {
                          getAddress(suggestion['text']);
                        }}
                        className="suggestion"
                      >
                        {suggestion['text']}
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
            <TextField
              label={t('donate:city')}
              variant="outlined"
              name="city"
              inputRef={register({ required: true })}
            ></TextField>
            {errors.city && (
              <span className={styles.formErrors}>
                {t('donate:cityRequired')}
              </span>
            )}
          </div>
          <div className={styles.formFieldHalf}>
            <TextField
              label={t('donate:zipCode')}
              variant="outlined"
              name="zipCode"
              inputRef={register({
                pattern: postalRegex,
                required: true,
              })}
            ></TextField>
            {errors.zipCode && (
              <span className={styles.formErrors}>
                {t('donate:zipCodeAlphaNumValidation')}
              </span>
            )}
          </div>
        </div>

        <div className={styles.formFieldLarge}>
          <AutoCompleteCountry
            defaultValue={country}
            onChange={setCountry}
            label={t('donate:country')}
            name="editProfile"
            countries={allCountries}
          />
          {errors.editProfile && (
            <span className={styles.formErrors}>
              {t('donate:countryRequired')}
            </span>
          )}
        </div>

        <InlineFormDisplayGroup type="other">
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
            defaultValue={false}
            render={(props: object) => (
              <ToggleSwitch
                checked={props.value}
                onChange={(e) => props.onChange(e.target.checked)}
                inputProps={{ 'aria-label': 'secondary checkbox' }}
                id="editPrivate"
              />
            )}
          />
        </InlineFormDisplayGroup>

        <InlineFormDisplayGroup type="other">
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
            defaultValue={false}
            render={(props: any) => (
              <ToggleSwitch
                checked={props.value}
                onChange={(e) => props.onChange(e.target.checked)}
                inputProps={{ 'aria-label': 'secondary checkbox' }}
                id="editGetNews"
              />
            )}
          />
        </InlineFormDisplayGroup>

        <div className={styles.horizontalLine} />

        <div className={styles.formFieldLarge}>
          <TextField
            label={t('editProfile:profileDescription')}
            variant="outlined"
            multiline
            rows={4}
            name="bio"
            inputRef={register({
              maxLength: 300,
            })}
          ></TextField>
        </div>
        {errors.bio && (
          <span className={styles.formErrors}>
            {t('editProfile:descriptionRequired')}
          </span>
        )}

        <div className={styles.formFieldLarge}>
          <TextField
            label={t('editProfile:website')}
            variant="outlined"
            name="url"
            inputRef={register({
              pattern: {
                //value: /^(?:http(s)?:\/\/)?[\w\.\-]+(?:\.[\w\.\-]+)+[\w\.\-_~:/?#[\]@!\$&'\(\)\*\+,;=#%]+$/,
                value:
                  /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=*]*)$/,
                message: t('editProfile:websiteError'),
              },
            })}
          ></TextField>
        </div>
        {errors.url && (
          <span className={styles.formErrors}>
            {t('editProfile:websiteRequired')}
          </span>
        )}

        <div className={styles.formFieldLarge}>
          <Button
            id={'editProfileSaveProfile'}
            variant="contained"
            color="primary"
            onClick={handleSubmit(saveProfile)}
          >
            {isUploadingData ? (
              <div className={styles.spinner}></div>
            ) : (
              t('editProfile:save')
            )}
          </Button>
        </div>
      </div>
      {/* snackbar for showing various messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
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
    </StyledForm>
  ) : null;
}
