import React from 'react';
import LandingSection from '../../../common/Layout/LandingSection';
import ProjectsContainer from '../components/ProjectsContainer';
import UserInfo from '../components/UserInfo';
import Settings from '../../../../../public/assets/images/icons/userProfileIcons/Settings';
import styles from '../styles/UserProfile.module.scss';
import AddTargetModal from '../components/AddTargetModal';
import SettingsModal from '../components/SettingsModal';

export default function TpoProfile({
  userprofile,
  authenticatedType,
  changeForceReload,
  forceReload,
}: any) {
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
        {/* Open setting component */}
        {settingsModalOpen && (
          <SettingsModal
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
          // handleTextCopiedSnackbarOpen={handleTextCopiedSnackbarOpen}
          handleAddTargetModalOpen={handleAddTargetModalOpen}
        />
      </LandingSection>
      <ProjectsContainer
        userprofile={userprofile}
        authenticatedType={authenticatedType}
      />

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
