import { Button, styled, TextField } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import React, { useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Controller, useForm } from 'react-hook-form';
import { User } from '@planet-sdk/common/build/types/user';
import Camera from '../../../../../public/assets/images/icons/userProfileIcons/Camera';
import CameraWhite from '../../../../../public/assets/images/icons/userProfileIcons/CameraWhite';
import { putAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import COUNTRY_ADDRESS_POSTALS from '../../../../utils/countryZipCode';
import getImageUrl from '../../../../utils/getImageURL';
import { selectUserType } from '../../../../utils/selectUserType';
import AutoCompleteCountry from '../../../common/InputTypes/AutoCompleteCountry';
import ToggleSwitch from '../../../common/InputTypes/ToggleSwitch';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import styles from './EditProfile.module.scss';
import GeocoderArcGIS from 'geocoder-arcgis';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import { useTranslations } from 'next-intl';
import { allCountries } from '../../../../utils/constants/countries';
import InlineFormDisplayGroup from '../../../common/Layout/Forms/InlineFormDisplayGroup';
import {
  MuiAutoComplete,
  StyledAutoCompleteOption,
} from '../../../common/InputTypes/MuiAutoComplete';
import StyledForm from '../../../common/Layout/StyledForm';
import {
  AddressSuggestionsType,
  AddressType,
} from '../../../common/types/geocoder';
import { AlertColor } from '@mui/lab';
import { APIError, handleError } from '@planet-sdk/common';
import { useTenant } from '../../../common/Layout/TenantContext';
import { ExtendedCountryCode } from '../../../common/types/country';

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

type ProfileTypeOption = {
  id: number;
  title: string;
  value: 'individual' | 'organization' | 'education';
};

export default function EditProfileForm() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { setErrors } = React.useContext(ErrorHandlingContext);
  const { user, setUser, token, contextLoaded, logoutUser } = useUserProps();
  const { tenantConfig } = useTenant();
  const [isUploadingData, setIsUploadingData] = React.useState(false);
  const t = useTranslations('EditProfile');

  const defaultProfileDetails = useMemo(() => {
    return {
      firstname: user?.firstname ? user.firstname : '',
      lastname: user?.lastname ? user.lastname : '',
      address:
        user?.address && user.address.address ? user.address.address : '',
      city: user?.address && user.address.city ? user.address.city : '',
      zipCode:
        user?.address && user.address.zipCode ? user.address.zipCode : '',
      isPrivate: user?.isPrivate ? user.isPrivate : false,
      getNews: user?.getNews ? user.getNews : false,
      bio: user?.bio ? user.bio : '',
      url: user?.url ? user.url : '',
      name: user?.type !== 'individual' && user?.name ? user.name : '',
    };
  }, [user]);

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onBlur',
    defaultValues: defaultProfileDetails,
  });

  const handleSnackbarOpen = () => {
    setSnackbarOpen(true);
  };
  const handleSnackbarClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const [country, setCountry] = React.useState<ExtendedCountryCode | ''>(
    user?.country || 'DE'
  );

  React.useEffect(() => {
    reset(defaultProfileDetails);
  }, [defaultProfileDetails]);

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
  const [type, setAccountType] = useState(
    user?.type ? user.type : 'individual'
  );
  const [localProfileType, setLocalProfileType] = useState<ProfileTypeOption>({
    id: 1,
    title: t('individual'),
    value: 'individual',
  });

  const profileTypes: ProfileTypeOption[] = [
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
    {
      id: 3,
      title: t('education'),
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
      acceptedFiles.forEach((file: Blob) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onabort = () => console.log('file reading was aborted');
        reader.onerror = () => console.log('file reading has failed');
        reader.onload = async (event) => {
          if (contextLoaded && token) {
            const bodyToSend = {
              imageFile: event.target?.result,
            };
            setSeverity('info');
            setSnackbarMessage(t('profilePicUpdated'));
            handleSnackbarOpen();

            try {
              const res = await putAuthenticatedRequest<User>(
                tenantConfig?.id,
                `/app/profile`,
                bodyToSend,
                token,
                logoutUser
              );
              if (user) {
                const newUserInfo = { ...user, image: res.image };
                setUpdatingPic(false);
                setUser(newUserInfo);
              }
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
        const res: User = await putAuthenticatedRequest(
          tenantConfig?.id,
          `/app/profile`,
          bodyToSend,
          token,
          logoutUser
        );
        setSeverity('success');
        setSnackbarMessage(t('profileSaved'));
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

  return (
    <StyledForm>
      <div className="inputContainer">
        <div {...getRootProps()}>
          <label htmlFor="upload">
            <div className={styles.profilePicDiv}>
              <input {...getInputProps()} />
              {updatingPic ? (
                <div className={styles.spinnerImage}></div>
              ) : user?.image ? (
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
            getOptionLabel={(option) => (option as ProfileTypeOption).title}
            isOptionEqualToValue={(option, selectedOption) =>
              (option as ProfileTypeOption).value ===
              (selectedOption as ProfileTypeOption).value
            }
            renderOption={(props, option) => {
              const { id, title } = option as ProfileTypeOption;
              return (
                <StyledAutoCompleteOption {...props} key={id}>
                  {title}
                </StyledAutoCompleteOption>
              );
            }}
            onChange={(event, newType) => {
              if (newType) {
                setAccountType((newType as ProfileTypeOption).value);
                setLocalProfileType(newType as ProfileTypeOption);
              }
            }}
            renderInput={(params) => (
              <TextField {...params} label={t('fieldLabels.profileType')} />
            )}
          />
        ) : null}
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
            render={({ field: { onChange, value, onBlur } }) => (
              <TextField
                label={t('fieldLabels.firstName')}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                error={errors.firstname !== undefined}
                helperText={
                  errors.firstname !== undefined && errors.firstname.message
                }
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
            render={({ field: { onChange, value, onBlur } }) => (
              <TextField
                label={t('fieldLabels.lastName')}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                error={errors.lastname !== undefined}
                helperText={
                  errors.lastname !== undefined && errors.lastname.message
                }
              />
            )}
          />
        </InlineFormDisplayGroup>
        <TextField
          label={t('fieldLabels.email')}
          name="email"
          defaultValue={user?.email}
          disabled
        ></TextField>
        {type && type !== 'individual' && (
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
              <TextField
                label={t('fieldLabels.name', {
                  type: selectUserType(type, t),
                })}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                error={errors.name !== undefined}
                helperText={errors.name !== undefined && errors.name.message}
              />
            )}
          />
        )}
        <div className={styles.formFieldLarge}>
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
            render={({
              field: { onChange: handleChange, value, onBlur: handleBlur },
            }) => (
              <TextField
                label={t('fieldLabels.address')}
                onChange={(event) => {
                  suggestAddress(event.target.value);
                  handleChange(event);
                }}
                onBlur={() => {
                  setaddressSugggestions([]);
                  handleBlur();
                }}
                value={value}
                error={errors.address !== undefined}
                helperText={
                  errors.address !== undefined && errors.address.message
                }
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
        </div>
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
            render={({ field: { onChange, value, onBlur } }) => (
              <TextField
                label={t('fieldLabels.city')}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                error={errors.city !== undefined}
                helperText={errors.city !== undefined && errors.city.message}
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
            render={({ field: { onChange, value, onBlur } }) => (
              <TextField
                label={t('fieldLabels.zipCode')}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                error={errors.zipCode !== undefined}
                helperText={
                  errors.zipCode !== undefined && errors.zipCode.message
                }
              />
            )}
          />
        </InlineFormDisplayGroup>
        <AutoCompleteCountry
          defaultValue={country}
          onChange={setCountry}
          label={t('fieldLabels.country')}
          name="editProfile"
          countries={allCountries}
        />
        <InlineFormDisplayGroup type="other">
          <div>
            <label
              htmlFor="editPrivate"
              className={styles.mainText}
              style={{ cursor: 'pointer' }}
            >
              {t('fieldLabels.privateAccount')}
            </label>{' '}
            <br />
            {watchIsPrivate && (
              <label className={styles.isPrivateAccountText}>
                {t('privateAccountTxt')}
              </label>
            )}
          </div>
          <Controller
            name="isPrivate"
            control={control}
            render={({ field: { onChange, value } }) => (
              <ToggleSwitch
                checked={value}
                onChange={onChange}
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
            {t('fieldLabels.subscribe')}
          </label>

          <Controller
            name="getNews"
            control={control}
            render={({ field: { onChange, value } }) => (
              <ToggleSwitch
                checked={value}
                onChange={onChange}
                inputProps={{ 'aria-label': 'secondary checkbox' }}
                id="editGetNews"
              />
            )}
          />
        </InlineFormDisplayGroup>

        <div className={styles.horizontalLine} />

        <Controller
          name="bio"
          control={control}
          rules={{
            maxLength: {
              value: 300,
              message: t('validationErrors.maxChars', { max: 300 }),
            },
          }}
          render={({ field: { onChange, value, onBlur } }) => (
            <TextField
              label={t('fieldLabels.bio')}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              multiline
              rows={4}
              error={errors.bio !== undefined}
              helperText={errors.bio !== undefined && errors.bio.message}
            />
          )}
        />

        <Controller
          name="url"
          control={control}
          rules={{
            pattern: {
              //value: /^(?:http(s)?:\/\/)?[\w\.\-]+(?:\.[\w\.\-]+)+[\w\.\-_~:/?#[\]@!\$&'\(\)\*\+,;=#%]+$/,
              value:
                /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=*]*)$/,
              message: t('validationErrors.websiteInvalid'),
            },
          }}
          render={({ field: { onChange, value, onBlur } }) => (
            <TextField
              label={t('fieldLabels.website')}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              error={errors.url !== undefined}
              helperText={errors.url !== undefined && errors.url.message}
            />
          )}
        />
      </div>
      <Button
        id={'editProfileSaveProfile'}
        variant="contained"
        color="primary"
        onClick={handleSubmit(saveProfile)}
        disabled={isUploadingData}
      >
        {isUploadingData ? <div className={styles.spinner}></div> : t('save')}
      </Button>

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
  );
}
