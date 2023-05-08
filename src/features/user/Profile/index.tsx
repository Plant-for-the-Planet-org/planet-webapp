import React, { ReactElement } from 'react';
import styles from './styles/Profile.module.scss';
import AddTargetModal from './components/AddTargetModal';
import LandingSection from '../../common/Layout/LandingSection';
import { useTranslation } from 'next-i18next';
import ReadMoreReact from 'read-more-react';
import UserShareAndSupport from './components/UserShareAndSupport';
import UserProfileOptions from './components/UserProfileOptions';
import TreeCounter from './../../common/TreeCounter/TreeCounter';
import { User } from '@planet-sdk/common';
import { PublicUser } from '../../common/types/user';

interface Props {
  userprofile: User | PublicUser;
  authenticatedType: string;
}

function Profile({ userprofile, authenticatedType }: Props): ReactElement {
  // External imports
  const { t, ready } = useTranslation(['donate']);

  // Internal States for authenticated users

  const [addTargetModalOpen, setAddTargetModalOpen] = React.useState(false);

  return (
    <div>
      {/* TO DO - find solution for this */}
      {/* maybe we use this as edit button */}
      {/* {authenticatedType === 'private' && (
        <button
          id={'IndividualProSetting'}
          className={styles.settingsIcon}
          onClick={() => {
            setSettingsModalOpen(!settingsModalOpen);
          }}
        >
          <Settings color="white" />
        </button>
      )} */}
      {/* userinfo section */}
      <LandingSection
        imageSrc={
          process.env.CDN_URL
            ? `${process.env.CDN_URL}/media/images/app/bg_layer.jpg`
            : `https://cdn.plant-for-the-planet.org/media/images/app/bg_layer.jpg`
        }
        style={{
          marginTop: '0px',
        }}
      >
        {/* {settingsModalOpen && (
          <SettingsModal
            userType="tpo"x
            userprofile={userprofile}
            settingsModalOpen={settingsModalOpen}
            handleSettingsModalClose={handleSettingsModalClose}
            editProfileModalOpen={editProfileModalOpen}
            handleEditProfileModalClose={handleEditProfileModalClose}
            handleEditProfileModalOpen={handleEditProfileModalOpen}
          />
        )} */}
        {userprofile && (
          <div className={styles.landingContent}>
            <TreeCounter
              handleAddTargetModalOpen={() => {
                setAddTargetModalOpen(true);
              }}
              authenticatedType={authenticatedType}
              target={userprofile?.score?.target}
              planted={
                userprofile.type == 'tpo'
                  ? userprofile.score.personal
                  : userprofile.score.personal + userprofile.score.received
              }
            />
            <h2 className={styles.treeCounterName}>
              {userprofile.displayName}
            </h2>
            {/* user bio */}
            <div className={styles.treeCounterDescription}>
              {ready ? (
                <ReadMoreReact
                  key={userprofile.bio || ''}
                  ideal={120}
                  readMoreText={t('donate:readMore')}
                  text={userprofile.bio || ''}
                />
              ) : null}
            </div>
            {/* icon for public view */}
            {authenticatedType === 'public' && (
              <UserShareAndSupport userprofile={userprofile} />
            )}
            {/* three icons in a row */}
            {authenticatedType === 'private' && (
              <UserProfileOptions userprofile={userprofile} />
            )}
          </div>
        )}
      </LandingSection>

      {/* add target modal */}
      <AddTargetModal
        userprofile={userprofile}
        addTargetModalOpen={addTargetModalOpen}
        handleAddTargetModalClose={() => setAddTargetModalOpen(false)}
      />
    </div>
  );
}

export default Profile;
