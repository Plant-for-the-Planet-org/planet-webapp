import React from 'react';
import styles from '../styles/UserInfo.module.scss';
import TreeCounter from './../../../common/TreeCounter/TreeCounter';
import UserProfileOptions from './UserProfileOptions';

export default function UserInfo({
  userprofile,
  handleTextCopiedSnackbarOpen,
  authenticatedType,
  handleAddTargetModalOpen
}: any) {
  return (
    <div className={styles.landingContent}>
      <TreeCounter
        handleAddTargetModalOpen={handleAddTargetModalOpen}
        authenticatedType={authenticatedType}
        target={userprofile.score.target}
        planted={userprofile.score.personal}
      />

      <h2 className={styles.treeCounterName}>{`${userprofile.displayName}`}</h2>

      {/* user bio */}
      <p className={styles.treeCounterDescription}>
        {userprofile.bio}{' '}
      </p>

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
