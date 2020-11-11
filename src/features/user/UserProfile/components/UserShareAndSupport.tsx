import React from 'react';
import { useRouter } from 'next/router';
import Share from '../../../../../public/assets/images/icons/userProfileIcons/Share';
import Support from '../../../../../public/assets/images/icons/userProfileIcons/Support';
import styles from '../styles/UserInfo.module.scss';

export default function UserShareAndSupport({ userprofile }: any) {
  const router = useRouter();
  return (
    <div className={styles.bottomIconsRow}>
      {userprofile.type !== 'tpo' && (
        <div
          className={styles.iconTextColumnSupport}
          onClick={() => {
            router.push(`/s/${userprofile.slug}`);
          }}
        >
          <div className={styles.bottomIconBgSupport}>
            <Support width="37px" paddingLeft="10px" />
            <p className={styles.bottomRowTextSupport}>Support</p>
          </div>
        </div>
      )}
      <div className={styles.iconTextColumnSupport}>
        <div className={styles.bottomIconBgSupport}>
          <Share width="39px" paddingLeft="10px" color="white" solid />
          <p className={styles.bottomRowTextSupport}>Share</p>
        </div>
      </div>
    </div>
  );
}
