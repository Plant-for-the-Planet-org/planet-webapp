import React from 'react';
import styles from '../styles/UserInfo.module.scss';
import TreeCounter from './../../../common/TreeCounter/TreeCounter';
import UserProfileOptions from './UserProfileOptions';
import UserShareAndSupport from './UserShareAndSupport';

export default function UserInfo({
  userprofile,
  handleTextCopiedSnackbarOpen,
  authenticatedType,
  handleAddTargetModalOpen
}: any) {
  console.log(authenticatedType)
  return (
    <div className={styles.landingContent}>
      <TreeCounter
        handleAddTargetModalOpen={handleAddTargetModalOpen}
        authenticatedType={authenticatedType}
        target={userprofile.score.target}
        planted={userprofile.score.personal}
      />

      <h2 className={styles.treeCounterName}>{userprofile.displayName}</h2>
      {/* user bio */}
      <p className={styles.treeCounterDescription}>
        {userprofile.bio}{' '}
      </p>
      {/* icon for public view */}
      {authenticatedType === 'public' && <UserShareAndSupport userprofile={userprofile}/>}
      
      {/* three icons in a row */}
      {
        authenticatedType === 'private' &&
        <UserProfileOptions
              userprofile={userprofile}
              handleTextCopiedSnackbarOpen={handleTextCopiedSnackbarOpen}
        />
      }
    </div>
  );
}
