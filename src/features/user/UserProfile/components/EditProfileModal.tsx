import React from 'react';
import styles from '../styles/EditProfileModal.module.scss';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import BackButton from '../../../../assets/images/icons/BackButton';
import Camera from '../../../../assets/images/icons/userProfileIcons/Camera';
import MaterialTextField from '../../../common/InputTypes/MaterialTextFeild';
import ToggleSwitch from '../../../common/InputTypes/ToggleSwitch';

export default function EditProfileModal({
  editProfileModalOpen,
  handleEditProfileModalClose,
}: any) {
  const [isPrivateAccount, setIsPrivateAccount] = React.useState(false);
  const [isSubscribed, setIsSubscribed] = React.useState(false);

  var profilePicStyle = {
    height: '100%',
    width: '100%',
    display: 'flex',
    borderRadius: '200px',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.7,
    backgroundImage: `url(https://img.freepik.com/free-photo/3d-grunge-room-interior-with-spotlight-smoky-atmosphere-background_1048-11333.jpg?size=626&ext=jpg)`,
  };

  return (
    <Modal
      className={styles.modalContainer}
      open={editProfileModalOpen}
    //   onClose={handleEditProfileModalClose}
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

          <div className={styles.profilePicDiv}>
            <div style={profilePicStyle}>
              <Camera color="white" />
            </div>
          </div>

          <div className={styles.namesDiv}>
            <div className={styles.firstNameDiv}>
              <MaterialTextField label="First Name" variant="outlined" />
            </div>

            <div className={styles.lastNameDiv}>
              <MaterialTextField label="Last Name" variant="outlined" />
            </div>
          </div>

          <div className={styles.addressDiv}>
            <MaterialTextField label="Address" variant="outlined" />
          </div>

          <div className={styles.cityZipDiv}>
            <div className={styles.cityDiv}>
              <MaterialTextField label="City" variant="outlined" />
            </div>
            <div className={styles.zipDiv}>
              <MaterialTextField label="Zip Code" variant="outlined" />
            </div>
          </div>

          <div className={styles.countryDiv}>
            <MaterialTextField label="Country" variant="outlined" />
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

          <div className={styles.horizontalLine}/>

          <div className={styles.profileDescriptionDiv}>
            <MaterialTextField label="Profile Desciption" variant="outlined" />
          </div>

          
          <div className={styles.websiteDiv}>
            <MaterialTextField label="Website" variant="outlined" />
          </div>

          <div
            className={styles.saveButton}
            onClick={handleEditProfileModalClose}
          >
            Save
          </div>
        </div>
      </Fade>
    </Modal>
  );
}
