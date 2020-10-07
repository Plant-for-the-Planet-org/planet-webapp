import React from 'react';
import styles from '../styles/UserInfo.module.scss';
import TreeCounter from './../../../common/TreeCounter/TreeCounter';
import UserProfileOptions from './UserProfileOptions';

export default function UserInfo({
  userprofile,
  handleTextCopiedSnackbarOpen,
}: any) {
  return (
    <div className={styles.landingContent}>
      <TreeCounter
        target={userprofile.countTarget || 22}
        planted={userprofile.countPlanted || 100}
      />

      <h2 className={styles.treeCounterName}>{`${userprofile.firstname} ${userprofile.lastname}`}</h2>

      {/* will render only if it is ME page */}
      {userprofile.isMe && (
        <React.Fragment>
          {/* user description */}
          <p className={styles.treeCounterDescription}>
            {userprofile.description}{' '}
          </p>

          {/* three icons in a row */}
          <UserProfileOptions
            userprofile={userprofile}
            handleTextCopiedSnackbarOpen={handleTextCopiedSnackbarOpen}
          />
        </React.Fragment>
      )}
    </div>
  );
}
