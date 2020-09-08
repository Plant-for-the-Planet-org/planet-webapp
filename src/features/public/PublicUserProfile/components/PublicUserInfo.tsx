import React from 'react';
import TreeCounter from '../../../common/TreeCounter/TreeCounter';
import styles from '../PublicUserProfile.module.scss';

export default function PublicUserInfo({ publicUserprofile }: any) {
  console.log('publicUserprofile', publicUserprofile);
  return (
    <div className={styles.landingContent}>
      <TreeCounter
        target={publicUserprofile.countTarget}
        planted={publicUserprofile.countPlanted}
      />

      <h2 className={styles.publicUserName}>{publicUserprofile.displayName}</h2>

      {/* publicUser description */}
      <p className={styles.publicUserDescription}>
        {publicUserprofile.userProfile.synopsis1
          ? publicUserprofile.userProfile.synopsis1
          : ''}
      </p>
    </div>
  );
}
