import type { AlertColor } from '@mui/lab';
import type { APIError } from '@planet-sdk/common';
import type { User, UserType } from '@planet-sdk/common/build/types/user';

import { styled, TextField } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import React, { useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Controller, useForm } from 'react-hook-form';
import Camera from '../../../../../public/assets/images/icons/userProfileIcons/Camera';
import getImageUrl from '../../../../utils/getImageURL';
import { selectUserType } from '../../../../utils/selectUserType';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import styles from './EditProfile.module.scss';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import { useLocale, useTranslations } from 'next-intl';
import InlineFormDisplayGroup from '../../../common/Layout/Forms/InlineFormDisplayGroup';
import {
  MuiAutoComplete,
  StyledAutoCompleteOption,
} from '../../../common/InputTypes/MuiAutoComplete';
import StyledForm from '../../../common/Layout/StyledForm';
import { handleError } from '@planet-sdk/common';
import Delete from '../../../../../public/assets/images/icons/manageProjects/Delete';
import CustomTooltip from '../../../common/Layout/CustomTooltip';
import NewToggleSwitch from '../../../common/InputTypes/NewToggleSwitch';
import { useRouter } from 'next/router';
import DefaultProfileImageIcon from '../../../../../public/assets/images/icons/headerIcons/DefaultProfileImageIcon';
import themeProperties from '../../../../theme/themeProperties';
import NewInfoIcon from '../../../../../public/assets/images/icons/projectV2/NewInfoIcon';
import { useApi } from '../../../../hooks/useApi';

const Alert = styled(MuiAlert)(({ theme }) => {
  return {
    backgroundColor: theme.palette.primary.main,
  };
});

type ProfileFormData = {
  address: string;
  bio: string;
  city: string;
  firstname: string;
  getNews: boolean;
  isPublic: boolean;
  lastname: string;
  name: string;
  url: string;
  zipCode: string;
  exposeCommunity: boolean;
  showTreegame: boolean;
};

type ProfileTypeOption = {
  id: number;
  title: string;
  value: 'individual' | 'organization' | 'education';
};

type UserProfileImage = {
  imageFile: string | ArrayBuffer | null | undefined;
};

type UpdateProfileApiPayload = Omit<ProfileFormData, 'isPublic'> & {
  isPrivate: boolean;
  type?: Omit<UserType, 'tpo'>;
};

export default function EditProfileForm() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { setErrors } = React.useContext(ErrorHandlingContext);
  const { user, setUser, token, contextLoaded } = useUserProps();
  const [isUploadingData, setIsUploadingData] = React.useState(false);
  const t = useTranslations('EditProfile');
  const locale = useLocale();
  const router = useRouter();
  const { putApiAuthenticated } = useApi();
  const defaultProfileDetails = useMemo(() => {
    return {
      firstname: user?.firstname ? user.firstname : '',
      lastname: user?.lastname ? user.lastname : '',
      address:
        user?.address && user.address.address ? user.address.address : '',
      city: user?.address && user.address.city ? user.address.city : '',
      zipCode:
        user?.address && user.address.zipCode ? user.address.zipCode : '',
      isPublic: user?.isPrivate === false ? true : false,
      getNews: user?.getNews ? user.getNews : false,
      bio: user?.bio ? user.bio : '',
      url: user?.url ? user.url : '',
      name: user?.type !== 'individual' && user?.name ? user.name : '',
      exposeCommunity: user?.exposeCommunity === true ? true : false,
    };
  }, [user]);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
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

  React.useEffect(() => {
    reset(defaultProfileDetails);
  }, [defaultProfileDetails]);

  const [updatingPic, setUpdatingPic] = React.useState(false);

  // the form values
  const [severity, setSeverity] = useState<AlertColor>('success');
  const [snackbarMessage, setSnackbarMessage] = useState('OK');
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

  const handleUserProfileImage = async (
    profileImagePayload: UserProfileImage
  ) => {
    try {
      const res = await putApiAuthenticated<User, UserProfileImage>(
        `/app/profile`,
        { payload: profileImagePayload }
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
  };

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
            const profileImagePayload = {
              imageFile: event.target?.result,
            };
            setSeverity('info');
            setSnackbarMessage(t('profilePicUpdated'));
            handleSnackbarOpen();
            handleUserProfileImage(profileImagePayload);
          }
        };
      });
    },
    [token]
  );

  const deleteProfilePicture = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    const profileImagePayload = {
      imageFile: null,
    };
    handleUserProfileImage(profileImagePayload);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    multiple: false,
    onDrop: onDrop,
    onDropAccepted: () => {},
  });

  const saveProfile = async (data: ProfileFormData) => {
    setIsUploadingData(true);
    const { isPublic, ...otherData } = data;

    const profilePayload = {
      ...otherData,
      isPrivate: !isPublic,
      ...(type !== 'tpo' ? { type: type } : {}),
    };

    if (contextLoaded && token) {
      try {
        const res = await putApiAuthenticated<User, UpdateProfileApiPayload>(
          `/app/profile`,
          { payload: profilePayload }
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

  return (
    <StyledForm>
      <div className="inputContainer">
        <div className={styles.profilePicDiv}>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            {updatingPic ? (
              <div className={styles.spinnerContainer}>
                <div className={styles.spinnerImage}></div>
              </div>
            ) : user?.image ? (
              <div className={styles.profilePic}>
                <img
                  src={getImageUrl('profile', 'thumb', user.image)}
                  className={styles.profilePicImg}
                />
              </div>
            ) : (
              <div className={styles.noProfilePic}>
                <DefaultProfileImageIcon />
              </div>
            )}
          </div>
          <div className={styles.profilePicDivButtons}>
            <button
              {...getRootProps()}
              className={styles.uploadProfilePicButton}
              aria-label="upload profile picture"
              type="button"
            >
              <div className={styles.profilePicButtonText}>
                <input {...getInputProps()} />
                <Camera />
                <span>{t('profilePictureButtonLabels.upload')}</span>
              </div>
            </button>
            <button
              className={styles.deleteProfilePicButton}
              onClick={(event) => deleteProfilePicture(event)}
              aria-label="delete profile picture"
              type="button"
            >
              <div className={styles.profilePicButtonText}>
                <Delete color="#828282" />
                <span>{t('profilePictureButtonLabels.delete')}</span>
              </div>
            </button>
          </div>
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
        {/* to be changed to fullname after api changes */}
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
                label={`${t('fieldLabels.firstName')}*`}
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
                label={`${t('fieldLabels.lastName')}*`}
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
        <InlineFormDisplayGroup>
          <TextField
            label={t('fieldLabels.email')}
            name="email"
            defaultValue={user?.email}
            disabled
          ></TextField>
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
        </InlineFormDisplayGroup>
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
                label={`${t('fieldLabels.name', {
                  type: selectUserType(type, t),
                })}*`}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                error={errors.name !== undefined}
                helperText={errors.name !== undefined && errors.name.message}
              />
            )}
          />
        )}

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

        <section className={styles.profileConsentSettings}>
          <h2>{t('profileConsentSettingsTitle')}</h2>
          <InlineFormDisplayGroup type="other">
            <div>
              <label
                htmlFor="is-public"
                className={styles.profileConsentSettingLabel}
                style={{ cursor: 'pointer' }}
              >
                {t('fieldLabels.isPublic')}
              </label>
              <br />
              <p className={styles.fieldExplanation}>
                {t('publicProfileExplanation')}
              </p>
            </div>
            <Controller
              name="isPublic"
              control={control}
              render={({ field: { onChange, value } }) => (
                <NewToggleSwitch
                  checked={value}
                  onChange={onChange}
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                  id="is-public"
                />
              )}
            />
          </InlineFormDisplayGroup>
          <div className={styles.horizontalLine} />
          <InlineFormDisplayGroup type="other">
            <label
              htmlFor="get-news"
              className={styles.profileConsentSettingLabel}
              style={{ cursor: 'pointer' }}
            >
              {t('fieldLabels.subscribe')}
            </label>

            <Controller
              name="getNews"
              control={control}
              render={({ field: { onChange, value } }) => (
                <NewToggleSwitch
                  checked={value}
                  onChange={onChange}
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                  id="get-news"
                />
              )}
            />
          </InlineFormDisplayGroup>
          <div className={styles.horizontalLine} />
          <InlineFormDisplayGroup type="other">
            <label
              htmlFor="expose-community"
              className={styles.profileConsentSettingLabel}
              style={{ cursor: 'pointer' }}
            >
              {t('fieldLabels.exposeCommunity')}
              <div className={styles.infoIcon}>
                <CustomTooltip
                  triggerElement={
                    <NewInfoIcon
                      width={14}
                      color={themeProperties.mediumGrayColor}
                    />
                  }
                  showTooltipPopups={true}
                >
                  <div className={styles.infoIconPopupContainer}>
                    {t('leaderboardTooltipExplanation')}
                  </div>
                </CustomTooltip>
              </div>
            </label>

            <Controller
              name="exposeCommunity"
              control={control}
              render={({ field: { onChange, value } }) => (
                <NewToggleSwitch
                  checked={value}
                  onChange={onChange}
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                  id="expose-community"
                />
              )}
            />
          </InlineFormDisplayGroup>
          {/* <div className={styles.horizontalLine} />
          <InlineFormDisplayGroup type="other">
            <label
              htmlFor="show-treegame"
              className={styles.profileConsentSettingLabel}
              style={{ cursor: 'pointer' }}
            >
              {t('fieldLabels.showTreegame')}
            </label>

            <Controller
              name="showTreegame"
              control={control}
              render={({ field: { onChange, value } }) => (
                <NewToggleSwitch
                  checked={value}
                  onChange={onChange}
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                  id="show-treegame"
                  disabled={true}
                />
              )}
            />
          </InlineFormDisplayGroup> */}
        </section>
      </div>
      <InlineFormDisplayGroup>
        <button
          onClick={(e) => {
            e.preventDefault();
            router.push(`/${locale}/t/${user?.slug}`);
          }}
          className={styles.viewPublicProfileButton}
        >
          {t('viewPublicProfile')}
        </button>
        <button
          onClick={handleSubmit(saveProfile)}
          disabled={isUploadingData}
          className={styles.saveProfileButton}
        >
          {isUploadingData ? <div className={styles.spinner}></div> : t('save')}
        </button>
      </InlineFormDisplayGroup>

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
