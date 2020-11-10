import React from 'react';
import Share from '../../../../../public/assets/images/icons/userProfileIcons/Share';
import Support from '../../../../../public/assets/images/icons/userProfileIcons/Support';
import { getUserInfo } from '../../../../utils/auth0/localStorageUtils';
import styles from '../styles/UserInfo.module.scss';

export default function UserShareAndSupport({ userprofile }: any) {
  return (
    <div className={styles.bottomIconsRow}>
      {getUserInfo() === null || getUserInfo().type !== 'tpo' ? (
        <div className={styles.iconTextColumnSupport}>
          <div className={styles.bottomIconBgSupport}>
            <Support width="37px" paddingLeft="10px" />
            <p className={styles.bottomRowTextSupport}>Support</p>
          </div>
        </div>
      ) : null}
      <div className={styles.iconTextColumnSupport}>
        <div className={styles.bottomIconBgSupport}>
          <Share width="39px" paddingLeft="10px" color="white" solid />
          <p className={styles.bottomRowTextSupport}>Share</p>
        </div>
      </div>
    </div>
  );
}
