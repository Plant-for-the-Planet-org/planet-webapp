import React from 'react';
import LandingSection from '../../../common/Layout/LandingSection';
import ProjectsContainer from '../components/ProjectsContainer';
import UserInfo from '../components/UserInfo';
// import SettingsModal from '../components/SettingsModal';
import Settings from '../../../../../public/assets/images/icons/userProfileIcons/Settings';
import styles from '../styles/UserProfile.module.scss';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import AddTargetModal from '../components/AddTargetModal';
import SettingsContainer from '../components/Settings';

export default function TpoProfile({
  userprofile,
  authenticatedType,
  changeForceReload,
  forceReload,
}: any) {
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
    setSettingsModalOpen(!settingsModalOpen);
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
    <>
      {authenticatedType === 'private' && (
        <>
          <div
            className={styles.settingsIcon}
            onClick={handleSettingsModalOpen}
          >
            <Settings color="white" />
          </div>
        </>
      )}
      <LandingSection
        imageSrc={
          process.env.CDN_URL
            ? `${process.env.CDN_URL}/media/images/app/bg_layer.jpg`
            : `https://cdn.plant-for-the-planet.org/media/images/app/bg_layer.jpg`
        }
      >
        {settingsModalOpen && (
          <SettingsContainer
            userType="tpo"
            userprofile={userprofile}
            settingsModalOpen={settingsModalOpen}
            handleSettingsModalClose={handleSettingsModalClose}
            editProfileModalOpen={editProfileModalOpen}
            handleEditProfileModalClose={handleEditProfileModalClose}
            handleEditProfileModalOpen={handleEditProfileModalOpen}
            changeForceReload={changeForceReload}
            forceReload={forceReload}
          />
        )}
        <UserInfo
          userprofile={userprofile}
          authenticatedType={authenticatedType}
          handleTextCopiedSnackbarOpen={handleTextCopiedSnackbarOpen}
          handleAddTargetModalOpen={handleAddTargetModalOpen}
        />
      </LandingSection>
      <ProjectsContainer
        userprofile={userprofile}
        authenticatedType={authenticatedType}
      />

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
    </>
  );
}
