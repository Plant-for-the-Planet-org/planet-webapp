import React from 'react';
import ReadMoreReact from 'read-more-react';
import styles from '../styles/UserInfo.module.scss';
import TreeCounter from './../../../common/TreeCounter/TreeCounter';
import UserProfileOptions from './UserProfileOptions';
import UserShareAndSupport from './UserShareAndSupport';

export default function UserInfo({
  userprofile,
  handleTextCopiedSnackbarOpen,
  authenticatedType,
  handleAddTargetModalOpen,
}: any) {
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
      <div className={styles.treeCounterDescription}>
        {userprofile.bio &&
        <ReadMoreReact
          min={300}
          ideal={350}
          max={450}
          readMoreText="read more"
          text={userprofile.bio}
        />
}
        {/* {userprofile.bio}{' '} */}
      </div>
      {/* icon for public view */}
      {authenticatedType === 'public' && (
        <UserShareAndSupport userprofile={userprofile} />
      )}

      {/* three icons in a row */}
      {authenticatedType === 'private' && (
        <UserProfileOptions
          userprofile={userprofile}
          handleTextCopiedSnackbarOpen={handleTextCopiedSnackbarOpen}
        />
      )}
    </div>
  );
}
