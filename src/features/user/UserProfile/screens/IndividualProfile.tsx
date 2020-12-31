import React, { useRef } from 'react';
import LandingSection from '../../../common/Layout/LandingSection';
import styles from '../styles/UserProfile.module.scss';
import Settings from '../../../../../public/assets/images/icons/userProfileIcons/Settings';
import MyForestContainer from '../components/MyForestContainer';
import UserInfo from '../components/UserInfo';
import AddTargetModal from '../components/AddTargetModal';
import SettingsModal from '../components/SettingsModal';
import MyTrees from '../components/MyTrees/MyTrees';

export default function IndividualProfile({
  userprofile,
  changeForceReload,
  forceReload,
  authenticatedType,
  isAuthenticated,
}: any) {
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
        {/* userinfo section */}
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
            handleAddTargetModalOpen={handleAddTargetModalOpen}
          />
        </LandingSection>

        <MyTrees
          isAuthenticated={isAuthenticated}
          authenticatedType={authenticatedType}
          profile={userprofile}
        />
      </main>

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
