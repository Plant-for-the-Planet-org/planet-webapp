import React, {useState} from 'react';
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
import { removeUserExistsInDB, getUserInfo, removeUserInfo, setUserInfo} from '../../../../utils/auth0/localStorageUtils'
import {getS3Image} from '../../../../utils/getImageURL'
import {editProfile} from '../../../../utils/auth0/apiRequests'

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
  // the form values
  const [firstName, setFirstName] = useState(userprofile.firstname);
  const [lastName, setLastName] = useState(userprofile.lastname);
  const [address, setAddress] = useState(userprofile.address.address);
  const [city, setCity] = useState(userprofile.address.city);
  const [zip, setZip] = useState(userprofile.address.zipCode);
  const [country, setCountry] = useState(userprofile.address.country);
  const [isPrivateAccount, setIsPrivateAccount] = useState(userprofile.isPrivate);
  const [isSubscribed, setIsSubscribed] = useState(userprofile.getNews);
  const [description, setDescription] = useState(userprofile.bio);
  const [website, setWebsite] = useState(userprofile.url);
  const [session, loading] = useSession()
  const [severity, setSeverity] = useState('success')
  const [snackbarMessage, setSnackbarMessage] = useState("OK")
  const [addImageButtonVisible, setAddImageButtonVisible] = useState(true)
  const [profilePic, setProfilePic] = useState(userprofile.image)
  
  const onDrop = React.useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file: any) => {
      const reader = new FileReader()
      reader.readAsDataURL(file);
      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = async (event) => {
        console.log('Base 64 version of image', event.target.result);
        if(!loading && session){
          const bodyToSend = {
            imageFile: event.target.result
          }
          setSeverity('info')
          setSnackbarMessage('Profile pic is being updated...')
          handleSnackbarOpen()
          const res = await editProfile(session, bodyToSend)
          const resJson = await res.json()
          const userInfo = getUserInfo()
          const newUserInfo = {...userInfo, profilePic: resJson.image}
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

  const saveProfile = async() => {
    const bodyToSend = {
      firstname: firstName,
      lastname: lastName,
      address,
      city,
      zipCode: zip,
      country: country,
      isPrivate: isPrivateAccount,
      getNews: isSubscribed,
      bio: description,
      url: website
    }
    if (!loading && session) {
      try{
      const res = await editProfile(session, bodyToSend)
      if (res.status === 200) {
        setSeverity('success')
        setSnackbarMessage('Saved Successfully!')
        handleSnackbarOpen()
        changeForceReload(!forceReload),
        handleEditProfileModalClose()
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
      } else {
        setSeverity('error')
        setSnackbarMessage('Error in updating profile')
        handleSnackbarOpen()
      }
    } catch (e) {
      setSeverity('error')
      setSnackbarMessage('Error in updating profile')
      handleSnackbarOpen()
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
      aria-describedby="simple-modal-description"
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

          {
            userprofile.image ? 
            (
              <div  {...getRootProps()} > 
              <label htmlFor="upload" >
                <div 
                  className={styles.profilePicDiv}>
                    <input {...getInputProps()} />
                    <img src={getS3Image('profile','thumb', getUserInfo().profilePic)} className={styles.profilePicImg} />      
                </div>
                </label>
                </div>
            )
            :
            (
              // this style doesn't matter
              <div  {...getRootProps()} > 
                <label htmlFor="upload" >
                  <div 
                  className={styles.profilePicDiv} >
                    <input {...getInputProps()} />
                    <Camera color="white" />
                </div>
                </label>
              </div>
            )
          }


          <div className={styles.namesDiv}>
            <div className={styles.firstNameDiv}>
              <MaterialTextField 
              onChange={(e)=> setFirstName(e.target.value)}
              label="First Name" 
              variant="outlined" 
              defaultValue={firstName}
              />
            </div>

            <div className={styles.lastNameDiv}>
              <MaterialTextField
              label="Last Name" 
              variant="outlined"
              onChange={(e)=> setLastName(e.target.value)} 
              defaultValue={lastName}
              />
            </div>
          </div>

          <div className={styles.addressDiv}>
            <MaterialTextField 
            onChange={(e)=> setAddress(e.target.value)} 
            defaultValue={address}
            label="Address" 
            variant="outlined" />
          </div>

          <div className={styles.cityZipDiv}>
            <div className={styles.cityDiv}>
              <MaterialTextField 
              onChange={(e)=> setCity(e.target.value)} 
              defaultValue={city}
              label="City" 
              variant="outlined" 
              />
            </div>
            <div className={styles.zipDiv}>
              <MaterialTextField 
              onChange={(e)=> setZip(e.target.value)} 
              defaultValue={zip}
              label="Zip Code" 
              variant="outlined" />
            </div>
          </div>

          <div className={styles.countryDiv}>
            <MaterialTextField 
            onChange={(e)=> setCountry(e.target.value)} 
            defaultValue={country}
            label="Country" 
            variant="outlined" />
          </div>

          <div className={styles.isPrivateAccountDiv}>
            <div>
              <div className={styles.mainText}>Private Account</div>
              <div className={styles.isPrivateAccountText}>
                Your profile is hidden and only your first name appears in the
                leaderboard
              </div>
            </div>
            <ToggleSwitch
              checked={isSubscribed}
              onChange={() => setIsSubscribed(!isSubscribed)}
              name="checkedB"
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
          </div>

          <div className={styles.isPrivateAccountDiv}>
            <div className={styles.mainText}>Subscribe to news via email</div>

            <ToggleSwitch
              checked={isPrivateAccount}
              onChange={() => setIsPrivateAccount(!isPrivateAccount)}
              name="checkedA"
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
          </div>

          <div className={styles.horizontalLine} />

          <div className={styles.profileDescriptionDiv}>
            <MaterialTextField 
            onChange={(e)=> setDescription(e.target.value)} 
            defaultValue={description}
            label="Profile Desciption" 
            variant="outlined" />
          </div>

          <div className={styles.websiteDiv}>
            <MaterialTextField 
            onChange={(e)=> setWebsite(e.target.value)} 
            defaultValue={website}
            label="Website" 
            variant="outlined" />
          </div>

          <div
            className={styles.saveButton}
            onClick={saveProfile}
          >
            Save
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
