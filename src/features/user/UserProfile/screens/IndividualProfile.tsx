import React, { useRef } from 'react';
import LandingSection from '../../../common/Layout/LandingSection';
import styles from '../styles/UserProfile.module.scss';
import Settings from '../../../../../public/assets/images/icons/userProfileIcons/Settings';
import MyForestContainer from '../components/MyForestContainer';
import UserInfo from '../components/UserInfo';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import SettingsModal from '../components/SettingsModal';
import AddTargetModal from '../components/AddTargetModal'
import Settings1 from '../components/Settings1';

export default function IndividualProfile({ userprofile, changeForceReload,
  forceReload, authenticatedType }: any) {

  const [textCopiedsnackbarOpen, setTextCopiedSnackbarOpen] = React.useState(
    false
  );

  const handleTextCopiedSnackbarOpen = () => {
    setTextCopiedSnackbarOpen(true);
  };
  const handleTextCopiedSnackbarClose = (
    event?: React.SyntheticEvent,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setTextCopiedSnackbarOpen(false);
  };

  // settings modal
  const [settingsModalOpen, setSettingsModalOpen] = React.useState(false);
  const handleSettingsModalClose = () => {
    setSettingsModalOpen(false);
  };
  const handleSettingsModalOpen = () => {
    setSettingsModalOpen(!settingsModalOpen);
  };

  // editProfile modal  (from settings modal)
  const [editProfileModalOpen, setEditProfileModalOpen] = React.useState(false);
  const handleEditProfileModalClose = () => {
    setEditProfileModalOpen(false);
  };
  const handleEditProfileModalOpen = () => {
    setEditProfileModalOpen(true);
  };

  // add target modal
  const [addTargetModalOpen, setAddTargetModalOpen] = React.useState(false);
  const handleAddTargetModalClose = () => {
    setAddTargetModalOpen(false);
  };
  const handleAddTargetModalOpen = () => {
    setAddTargetModalOpen(true);
  };

  return (
    <React.Fragment>
      <main>
        {
          authenticatedType === 'private' &&
          (
            <>
            <div
              className={styles.settingsIcon}
              onClick={handleSettingsModalOpen}
            >
              <Settings color="white" />
            </div>
            {/* <SettingsModal
              userprofile={userprofile}
              settingsModalOpen={settingsModalOpen}
              handleSettingsModalClose={handleSettingsModalClose}
              editProfileModalOpen={editProfileModalOpen}
              handleEditProfileModalClose={handleEditProfileModalClose}
              handleEditProfileModalOpen={handleEditProfileModalOpen}
              changeForceReload={changeForceReload}
              forceReload={forceReload}
            /> */}
            </>
          )
        }  
        {/* userinfo section */}
        <LandingSection
          imageSrc={
            process.env.CDN_URL
              ? `${process.env.CDN_URL}/media/images/app/bg_layer.jpg`
              : `https://cdn.plant-for-the-planet.org/media/images/app/bg_layer.jpg`
          }
        >
          {settingsModalOpen && <Settings1 
                          userprofile={userprofile}
                          settingsModalOpen={settingsModalOpen}
                          handleSettingsModalClose={handleSettingsModalClose}
                          editProfileModalOpen={editProfileModalOpen}
                          handleEditProfileModalClose={handleEditProfileModalClose}
                          handleEditProfileModalOpen={handleEditProfileModalOpen}
                          changeForceReload={changeForceReload}
                          forceReload={forceReload}
          />}
          
          <UserInfo
            userprofile={userprofile}
            authenticatedType={authenticatedType}
            handleTextCopiedSnackbarOpen={handleTextCopiedSnackbarOpen}
            handleAddTargetModalOpen={handleAddTargetModalOpen}
          />
        </LandingSection>

        {/* my forest section  - if contains projects field*/}
        {authenticatedType === 'private' && userprofile.projects && (
          <div className={styles.myForestContainer}>
            <MyForestContainer userprofile={userprofile} />
          </div>
        )}

      </main>

      {/* snackbar for showing text copied to clipboard */}
      <Snackbar
        open={textCopiedsnackbarOpen}
        autoHideDuration={4000}
        onClose={handleTextCopiedSnackbarClose}
      >
        <MuiAlert 
        elevation={6} 
        variant="filled"
        onClose={handleTextCopiedSnackbarClose} 
        severity="success"
        >
          Text Copied to Clipboard!
        </MuiAlert>
      </Snackbar>

      {/* add target modal */}
      <AddTargetModal
        userprofile={userprofile}
        addTargetModalOpen={addTargetModalOpen}
        handleAddTargetModalClose={handleAddTargetModalClose}
        changeForceReload={changeForceReload}
        forceReload={forceReload}
      />
    </React.Fragment>
  );
}
