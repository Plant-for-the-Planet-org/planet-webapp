import React from 'react';
import ReadMoreReact from 'read-more-react';
import styles from '../styles/UserInfo.module.scss';
import i18next from '../../../../../i18n';
import TreeCounter from './../../../common/TreeCounter/TreeCounter';
import UserProfileOptions from './UserProfileOptions';
import UserShareAndSupport from './UserShareAndSupport';

const { useTranslation } = i18next;
export default function UserInfo({
  userprofile,
  authenticatedType,
  handleAddTargetModalOpen,
}: any) {
  const { t, ready } = useTranslation(['donate']);
  return (
    <div className={styles.landingContent}>
    <TreeCounter
        handleAddTargetModalOpen={handleAddTargetModalOpen}
        authenticatedType={authenticatedType}
        target={userprofile.score.target}
        planted={userprofile.type == "tpo" ? userprofile.score.personal :
        userprofile.score.personal + userprofile.score.received}
      />

      <h2 className={styles.treeCounterName}>{userprofile.displayName}</h2>
      {/* user bio */}
      <div className={styles.treeCounterDescription}>
      {ready ? (
        <ReadMoreReact
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
        <UserProfileOptions
          userprofile={userprofile}
        />
      )}
    </div>
  );
}
