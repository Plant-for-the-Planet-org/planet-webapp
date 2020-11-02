import React, { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/client';
import Snackbar from '@material-ui/core/Snackbar';
import styles from '../styles/EditProfileModal.module.scss';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import BackButton from '../../../../../public/assets/images/icons/BackButton';
import { useDropzone } from 'react-dropzone';
import Camera from '../../../../../public/assets/images/icons/userProfileIcons/Camera';
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import ToggleSwitch from '../../../common/InputTypes/ToggleSwitch';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { removeUserExistsInDB, getUserInfo, removeUserInfo, setUserInfo } from '../../../../utils/auth0/localStorageUtils'
import { getS3Image } from '../../../../utils/getImageURL'
import { editProfile } from '../../../../utils/auth0/apiRequests'
import { useForm, Controller } from 'react-hook-form';
import COUNTRY_ADDRESS_POSTALS from '../../../../utils/countryZipCode';
import AutoCompleteCountry from '../../../common/InputTypes/AutoCompleteCountry';

export default function EditProfileModal({
  userprofile,
  editProfileModalOpen,
  handleEditProfileModalClose,
  changeForceReload,
  forceReload,
}: any) {

  const [snackbarOpen, setSnackbarOpen] = useState(
    false
  );

  const [isUploadingData, setIsUploadingData] = React.useState(false)


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
      address: userprofile.address.address ? userprofile.address.address : '',
      city: userprofile.address.city ? userprofile.address.city : '',
      zipCode: userprofile.address.zipCode ? userprofile.address.zipCode : '',
      country: userprofile.address.country ? userprofile.address.country : '',
      isPrivate: userprofile.isPrivate ? userprofile.isPrivate : false,
      getNews: userprofile.getNews ? userprofile.getNews : false,
      bio: userprofile.bio ? userprofile.bio : '',
      url: userprofile.url ? userprofile.url : ''
    }
    reset(defaultProfileDetails)
  }, [userprofile])

  const { register, handleSubmit, errors, control, reset, setValue, watch, getValues } = useForm({ mode: 'onBlur' });

  const [country, setCountry] = React.useState(userprofile.country)

  const [postalRegex, setPostalRegex] = React.useState(COUNTRY_ADDRESS_POSTALS.filter((item) => item.abbrev === country)[0]?.postal)
  React.useEffect(() => {
    const fiteredCountry = COUNTRY_ADDRESS_POSTALS.filter((item) => item.abbrev === country);
    setPostalRegex(fiteredCountry[0]?.postal);
  }, [country]);

  // the form values
  const [session, loading] = useSession()
  const [severity, setSeverity] = useState('success')
  const [snackbarMessage, setSnackbarMessage] = useState("OK")

  const onDrop = React.useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file: any) => {
      const reader = new FileReader()
      reader.readAsDataURL(file);
      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = async (event) => {
        if (!loading && session) {
          const bodyToSend = {
            imageFile: event.target.result
          }
          setSeverity('info')
          setSnackbarMessage('Profile pic is being updated...')
          handleSnackbarOpen()
          const res = await editProfile(session, bodyToSend)
          const resJson = await res.json()
          const userInfo = getUserInfo()
          const newUserInfo = { ...userInfo, profilePic: resJson.image }
          setUserInfo(newUserInfo)
        }
      }
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'image/*',
    multiple: false,
    onDrop: onDrop,
    onDropAccepted: () => {
      console.log('uploaded');
    },
  });

  const saveProfile = async (data: any) => {
    setIsUploadingData(true)
    const bodyToSend = {
      ...data,
      country: country
    }
    console.log('bodyToSend', bodyToSend);
    if (!loading && session) {
      try {
        const res = await editProfile(session, bodyToSend)
        if (res.status === 200) {
          setSeverity('success')
          setSnackbarMessage('Saved Successfully!')
          handleSnackbarOpen()
          changeForceReload(!forceReload),
          handleEditProfileModalClose()
          setIsUploadingData(false)
        } else if (res.status === 401) {
          // in case of 401 - invalid token: signIn()
          setSeverity('error')
          setSnackbarMessage('Error in updating profile')
          handleSnackbarOpen()
          console.log('in 401-> unauthenticated user / invalid token')
          signOut()
          removeUserExistsInDB()
          removeUserInfo()
          signIn('auth0', { callbackUrl: '/login' });
          setIsUploadingData(false)
        } else {
          setSeverity('error')
          setSnackbarMessage('Error in updating profile')
          handleSnackbarOpen()
          setIsUploadingData(false)
        }
      } catch (e) {
        setSeverity('error')
        setSnackbarMessage('Error in updating profile')
        handleSnackbarOpen()
        setIsUploadingData(false)
      }
    }
  }
  return (
    <React.Fragment>
      <Modal
        className={styles.modalContainer}
        open={editProfileModalOpen}
        //onClose={handleEditProfileModalClose}
        closeAfterTransition
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-bio"
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={editProfileModalOpen}>
          <div className={styles.modal}>

            <div className={styles.headerDiv}>
              <div className={styles.backDiv} onClick={handleEditProfileModalClose}>
                <BackButton style={{}} />
              </div>
              <div className={styles.editProfileText}>
                {' '}
                <b> Edit Profile </b>
              </div>
            </div>


            <div {...getRootProps()} style={{ display: 'flex', justifyContent: 'center' }}>
              <label htmlFor="upload" >
                <div
                  className={styles.profilePicDiv}>
                  <input {...getInputProps()} />
                  {userprofile.image ? <img src={getS3Image('profile', 'thumb', getUserInfo().profilePic)} className={styles.profilePicImg} /> : <Camera color="white" />}
                </div>
              </label>
            </div>

            <div>

              <div className={styles.formField}>

                <div className={styles.formFieldHalf}>
                  <MaterialTextField
                    label="First Name"
                    variant="outlined"
                    name="firstname"
                    inputRef={register()}
                  />
                  {errors.firstname && (
                    <span className={styles.formErrors}>
                      Please enter valid first name
                    </span>
                  )}
                </div>
                <div style={{ width: '20px' }}></div>
                <div className={styles.formFieldHalf}>
                  <MaterialTextField
                    label="Last Name"
                    variant="outlined"
                    name="lastname"
                    inputRef={register()}
                  />
                  {errors.lastname && (
                    <span className={styles.formErrors}>
                      Please enter valid last name
                    </span>
                  )}
                </div>
              </div>

            </div>


            <div className={styles.formFieldLarge}>
              <MaterialTextField
                label="Address"
                variant="outlined"
                name="address"
                inputRef={register()}
              />
              {errors.address && (
                <span className={styles.formErrors}>
                  Please enter valid Address
                </span>
              )}
            </div>

            <div className={styles.formField}>
              <div className={styles.formFieldHalf}>
                <MaterialTextField
                  label="City"
                  variant="outlined"
                  name="city"
                  inputRef={register()}
                />
                {errors.city && (
                  <span className={styles.formErrors}>
                    Please enter valid city
                  </span>
                )}
              </div>
              <div style={{ width: '20px' }}></div>
              <div className={styles.formFieldHalf}>
                <MaterialTextField
                  label="Zip Code"
                  variant="outlined"
                  name="zipCode"
                  inputRef={register({
                    pattern: postalRegex
                  })}
                />
                {errors.zipCode && (
                  <span className={styles.formErrors}>
                    Please enter valid Zipcode
                  </span>
                )}
              </div>
            </div>

            <div className={styles.formFieldLarge}>
              <AutoCompleteCountry
                inputRef={null}
                defaultValue={country}
                onChange={setCountry}
                label={'Country'}
                name="country"
              />
              {errors.country && (
                <span className={styles.formErrors}>
                  Please enter valid Country
                </span>
              )}
            </div>

            <div className={styles.isPrivateAccountDiv}>
              <div>
                <div className={styles.mainText}>Private Account</div>
                <div className={styles.isPrivateAccountText}>
                  Your profile is hidden and only your first name appears in the
                  leaderboard
              </div>
              </div>
              <Controller
                name="isPrivate"
                control={control}
                inputRef={register()}
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
              <div className={styles.mainText}>Subscribe to news via email</div>

              <Controller
                name="getNews"
                control={control}
                inputRef={register()}
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

            <div className={styles.formFieldLarge}>
              <MaterialTextField
                label="Profile Desciption"
                variant="outlined"
                name="bio"
                inputRef={register()}
              />

            </div>
            {errors.bio && (
              <span className={styles.formErrors}>
                Please enter valid Description
              </span>
            )}

            <div className={styles.formFieldLarge}>
              <MaterialTextField
                label="Website"
                variant="outlined"
                name="url"
                inputRef={register({
                  pattern: {
                    value: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/,
                    message: 'Invalid website URL',
                  },
                })}
              />

            </div>
            {errors.url && (
              <span className={styles.formErrors}>
                Please enter valid Website URL
              </span>
            )}

            <div className={styles.formFieldLarge} style={{justifyContent:'center'}}>
              <div
                className={styles.saveButton}
                onClick={handleSubmit(saveProfile)}
              >
               {isUploadingData ? <div className={styles.spinner}></div> : "Save"}
              </div>
            </div>

          </div>
        </Fade>
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
