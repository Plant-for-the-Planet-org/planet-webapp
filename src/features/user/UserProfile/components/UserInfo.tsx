import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
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
        target={userprofile.countTarget}
        planted={userprofile.countPlanted}
      />

      <h2 className={styles.treeCounterName}>{userprofile.displayName}</h2>

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
