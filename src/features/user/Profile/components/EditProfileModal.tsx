import React, { useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import styles from '../styles/EditProfileModal.module.scss';
import Modal from '@material-ui/core/Modal';
import BackButton from '../../../../../public/assets/images/icons/headerIcons/BackArrow';
import { useDropzone } from 'react-dropzone';
import CameraWhite from '../../../../../public/assets/images/icons/userProfileIcons/CameraWhite';
import Camera from '../../../../../public/assets/images/icons/userProfileIcons/Camera';
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import ToggleSwitch from '../../../common/InputTypes/ToggleSwitch';
import MuiAlert from '@material-ui/lab/Alert';
import getImageUrl from '../../../../utils/getImageURL';
import { useForm, Controller } from 'react-hook-form';
import COUNTRY_ADDRESS_POSTALS from '../../../../utils/countryZipCode';
import AutoCompleteCountry from '../../../common/InputTypes/AutoCompleteCountry';
import i18next from '../../../../../i18n';
import { putAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import { selectUserType } from '../../../../utils/selectUserType';
import { ThemeContext } from '../../../../theme/themeContext';
import { MenuItem } from '@material-ui/core';
import { UserPropsContext } from '../../../common/Layout/UserPropsContext';

const { useTranslation } = i18next;

interface Props {
  editProfileModalOpen: any;
  handleEditProfileModalClose: any;
}

export default function EditProfileModal({
  editProfileModalOpen,
  handleEditProfileModalClose,
}: Props) {
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
    const bodyToSend = {
      ...data,
      country: country,
    };
    if (contextLoaded && token) {
      try {
        putAuthenticatedRequest(`/app/profile`, bodyToSend, token)
          .then((res) => {
            console.log(res);
            if(res.code !== 400) {
              setSeverity('success');
              setSnackbarMessage(ready ? t('editProfile:profileSaved') : '');
              handleSnackbarOpen();
              handleEditProfileModalClose();
              setIsUploadingData(false);
              setUser(res);
            } else {
              setSeverity('error');
            setSnackbarMessage(ready ? t('editProfile:profileSaveFailed') : '');
            handleSnackbarOpen();
            setIsUploadingData(false);
            handleEditProfileModalClose();
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
  const { theme } = React.useContext(ThemeContext);
  return ready ? (
    <React.Fragment>
      <Modal
        className={'modalContainer' + ' ' + theme}
        open={editProfileModalOpen}
        //onClose={handleEditProfileModalClose}
        closeAfterTransition
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-bio"
        hideBackdrop
      >
        <div className={styles.modal}>
          <div>
            <div className={styles.headerDiv}>
              <button
                id={'backButtonEditP'}
                className={styles.backDiv}
                onClick={handleEditProfileModalClose}
              >
                <BackButton style={{}} />
              </button>
              <div className={styles.editProfileText}>
                {' '}
                <b> {t('editProfile:edit')} </b>
              </div>
            </div>

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
            {user.type !== 'tpo' ? (
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

            {user.type && type !== 'individual' && (
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
                render={(props) => (
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
                render={(props) => (
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
              style={{ justifyContent: 'center' }}
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
        </div>
      </Modal>
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
    </React.Fragment>
  ) : null;
}
