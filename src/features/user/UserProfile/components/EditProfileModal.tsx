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
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import {  getUserInfo, setUserInfo } from '../../../../utils/auth0/localStorageUtils'
import getImageUrl from '../../../../utils/getImageURL'
import { useForm, Controller } from 'react-hook-form';
import COUNTRY_ADDRESS_POSTALS from '../../../../utils/countryZipCode';
import AutoCompleteCountry from '../../../common/InputTypes/AutoCompleteCountry';
import i18next from '../../../../../i18n';
import { useAuth0 } from '@auth0/auth0-react';
import { putAuthenticatedRequest } from '../../../../utils/apiRequests/api';

const { useTranslation } = i18next;
export default function EditProfileModal({
  userprofile,
  editProfileModalOpen,
  handleEditProfileModalClose,
  changeForceReload,
  forceReload,
}: any) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [token, setToken] = React.useState('')
  const {
    isLoading,
    isAuthenticated,
    getAccessTokenSilently
  } = useAuth0();
  // This effect is used to get and update UserInfo if the isAuthenticated changes
  React.useEffect(() => {
    async function loadFunction() {
      const token = await getAccessTokenSilently();
      setToken(token);
    }
    if (isAuthenticated && !isLoading) {
      loadFunction()
    }
  }, [isAuthenticated, isLoading])

  const [isUploadingData, setIsUploadingData] = React.useState(false)
  const { t } = useTranslation(['editProfile', 'donate', 'target']);

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
      firstname: userprofile.firstname ? userprofile.firstname : '',
      lastname: userprofile.lastname ? userprofile.lastname : '',
      address: userprofile.address &&  userprofile.address.address ? userprofile.address.address : '',
      city:  userprofile.address &&  userprofile.address.city ? userprofile.address.city : '',
      zipCode:  userprofile.address &&  userprofile.address.zipCode ? userprofile.address.zipCode : '',
      country:  userprofile.address && userprofile.address.country ? userprofile.address.country : '',
      isPrivate: userprofile.isPrivate ? userprofile.isPrivate : false,
      getNews: userprofile.getNews ? userprofile.getNews : false,
      bio: userprofile.bio ? userprofile.bio : '',
      url: userprofile.url ? userprofile.url : '',
      name: userprofile.name ? userprofile.name : ''
    };
    reset(defaultProfileDetails);
  }, [userprofile]);

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

  const [country, setCountry] = React.useState(userprofile.country);

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
  const [severity, setSeverity] = useState('success')
  const [snackbarMessage, setSnackbarMessage] = useState("OK");
  const watchIsPrivate = watch('isPrivate');

  const onDrop = React.useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file: any) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = async (event) => {
        if (!isLoading && token) {
          const bodyToSend = {
            imageFile: event.target.result
          }
          setSeverity('info')
          setSnackbarMessage(t('editProfile:profilePicUpdated'))
          handleSnackbarOpen()

          putAuthenticatedRequest(`/app/profile`, bodyToSend, token).then((res)=>{
            const userInfo = getUserInfo()
            const newUserInfo = { ...userInfo, profilePic: res.image }
            setUserInfo(newUserInfo)
          }).catch(error => {
            console.log(error);
          })
        }
      };
    });
  }, []);

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
      country: country
    }
    if (!isLoading && token) {
      try {
        putAuthenticatedRequest(`/app/profile`, bodyToSend, token).then((res)=>{
          setSeverity('success')
          setSnackbarMessage(t('editProfile:profileSaved'))
          handleSnackbarOpen()
          changeForceReload(!forceReload),
          handleEditProfileModalClose()
          setIsUploadingData(false)
        }).catch(error => {
          setSeverity('error')
          setSnackbarMessage(t('editProfile:profileSaveFailed'))
          handleSnackbarOpen()
          setIsUploadingData(false)
          console.log(error);
        })
      } catch (e) {
        setSeverity('error');
        setSnackbarMessage(t('editProfile:profileSaveFailed'));
        handleSnackbarOpen();
        setIsUploadingData(false);
      }
    }
  };
  return (
    <React.Fragment>
      <Modal
        className={styles.modalContainer}
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
              <div
                className={styles.backDiv}
                onClick={handleEditProfileModalClose}
              >
                <BackButton style={{}} />
              </div>
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
                  {userprofile.image ? (
                    <div className={styles.profilePic}>
                      <img
                        src={getImageUrl(
                          'profile',
                          'thumb',
                          getUserInfo().profilePic
                        )}
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

            <div className={styles.formField}>
              <div className={styles.formFieldHalf}>
                <MaterialTextField
                  label={t('donate:firstName')}
                  variant="outlined"
                  name="firstname"
                  inputRef={register()}
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
                  inputRef={register()}
                />
                {errors.lastname && (
                  <span className={styles.formErrors}>
                    {t('donate:lastNameRequired')}
                  </span>
                )}
              </div>
            </div>

            {userprofile.type === 'tpo' && (
              <div className={styles.formFieldLarge}>
              <MaterialTextField
                label={t('donate:nameOfOrg')}
                variant="outlined"
                name="name"
                inputRef={register()}
              />
              {errors.name && (
                <span className={styles.formErrors}>
                  {t('donate:nameOfOrgIsRequired')}
                </span>
              )}
            </div>
            )}

            <div className={styles.formFieldLarge}>
              <MaterialTextField
                label={t('donate:address')}
                variant="outlined"
                name="address"
                inputRef={register()}
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
                  inputRef={register()}
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
                <div className={styles.mainText}>
                  {t('editProfile:privateAccount')}
                </div>
                {watchIsPrivate && (
                  <div className={styles.isPrivateAccountText}>
                    {t('editProfile:privateAccountTxt')}
                  </div>
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
                  />
                )}
              />
            </div>

            <div className={styles.isPrivateAccountDiv}>
              <div className={styles.mainText}>
                {t('editProfile:subscribe')}
              </div>

              <Controller
                name="getNews"
                control={control}
                inputRef={register()}
                render={(props) => (
                  <ToggleSwitch
                    checked={props.value}
                    onChange={(e) => props.onChange(e.target.checked)}
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
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
                    value: /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=\*]*)$/,
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
              <div
                className={styles.saveButton}
                onClick={handleSubmit(saveProfile)}
              >
                {isUploadingData ? (
                  <div className={styles.spinner}></div>
                ) : (
                  t('editProfile:save')
                )}
              </div>
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
  );
}
