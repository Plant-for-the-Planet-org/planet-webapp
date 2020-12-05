import React from 'react';
import styles from '../styles/UserInfo.module.scss';
import TreeCounter from './../../../common/TreeCounter/TreeCounter';
import UserProfileOptions from './UserProfileOptions';
import UserShareAndSupport from './UserShareAndSupport';
import { trimwords } from '../../../../utils/TruncateText';

export default function UserInfo({
  userprofile,
  authenticatedType,
  handleAddTargetModalOpen,
}: any) {
  const [readMore, setReadMore] = React.useState(false);
  React.useEffect(() => {
    if (userprofile.bio && userprofile.bio.length <= 120) {
      setReadMore(true);
    }
  })
  return (
    <div className={styles.landingContent}>
      <TreeCounter
        handleAddTargetModalOpen={handleAddTargetModalOpen}
        authenticatedType={authenticatedType}
        target={userprofile.score.target}
        planted={userprofile.score.personal + userprofile.score.received}
      />

      <h2 className={styles.treeCounterName}>{userprofile.displayName}</h2>
      {/* user bio */}
      <div className={styles.treeCounterDescription}>
        {userprofile.bio && trimwords(userprofile.bio, 120, readMore)}
        {userprofile.bio && !readMore && <p onClick={()=>setReadMore(true)}>read more</p>}
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
        />
      )}
    </div>
  );
}
