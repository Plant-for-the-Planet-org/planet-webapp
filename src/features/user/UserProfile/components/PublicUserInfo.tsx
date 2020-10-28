import React from 'react';
import TreeCounter from '../../../common/TreeCounter/TreeCounter';
import styles from '../styles/PublicUserProfile.module.scss';

export default function PublicUserInfo({ userprofile }: any) {
  return (
    <div className={styles.landingContent}>
      <TreeCounter
        target={userprofile.score.target}
        planted={userprofile.score.personal}
      />

      <h2 className={styles.publicUserName}>{userprofile.displayName}</h2>

      {/* publicUser description */}
      <p className={styles.publicUserDescription}>
        {userprofile.bio}
      </p>
    </div>
  );
}
