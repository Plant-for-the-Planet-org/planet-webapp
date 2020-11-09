import React from 'react';
import styles from '../styles/UserInfo.module.scss';
import TreeCounter from './../../../common/TreeCounter/TreeCounter';
import UserProfileOptions from './UserProfileOptions';
import i18next from '../../../../../i18n';

const {useTranslation} = i18next;
export default function UserInfo({
  userprofile,
  handleTextCopiedSnackbarOpen,
  authenticatedType,
  handleAddTargetModalOpen
}: any) {
  const {t} = useTranslation(['user', 'me']);
  console.log(userprofile);
  return (
    <div className={styles.landingContent}>
      <TreeCounter
        handleAddTargetModalOpen={handleAddTargetModalOpen}
        authenticatedType={authenticatedType}
        target={userprofile.score.target}
        planted={userprofile.score.personal}
      />

      <h2 className={styles.treeCounterName}>{t('me:displayName', {
        name: userprofile.displayName
      })}</h2>
      {/* user bio */}
      <p className={styles.treeCounterDescription}>
        {t('me:displayName', {
          name: userprofile.bio
        })}
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
