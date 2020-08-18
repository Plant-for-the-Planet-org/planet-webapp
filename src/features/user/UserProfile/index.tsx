import React, { useRef } from 'react';
import LandingSection from '../../common/Layout/LandingSection';
import TreeCounter from './../../common/TreeCounter/TreeCounter';
import styles from './UserProfile.module.scss';
import Settings from '../../../assets/images/icons/userProfileIcons/Settings';
import ScrollDown from '../../../assets/images/icons/userProfileIcons/ScrollDown';
import UserProfileOptions from './components/UserProfileOptions';
import MyForestContainer from './components/MyForestContainer';
import Footer from '../../common/Footer';

export default function UserProfile({ userprofile }: any) {
  const scrollRef = useRef(null);
  
  function handleClick() {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }

  return (
    <React.Fragment>
      <main>
        {/* will render only if it is ME page */}
        {userprofile.isMe && (
          <div className={styles.settingsIcon}>
            <Settings color="white" />
          </div>
        )}
        {userprofile.isMe && (
          <div className={styles.downIcon} onClick={handleClick}>
            <ScrollDown color="white" />
          </div>
        )}

        <LandingSection>
          <div className={styles.landingContent}>
            <TreeCounter
              target={userprofile.countTarget}
              planted={userprofile.countPlanted}
            />

            <h2 className={styles.treeCounterName}>
              {userprofile.displayName}
            </h2>

            {/* will render only if it is ME page */}
            {userprofile.isMe && (
              <React.Fragment>
                {/* user description */}
                <p className={styles.treeCounterDescription}>
                  {userprofile.description}{' '}
                </p>

                {/* three icons in a row */}
                <UserProfileOptions userprofile={userprofile} />
              </React.Fragment>
            )}
          </div>
        </LandingSection>

        {/* my forest section */}
        {userprofile.isMe && (
          <div ref={scrollRef} className={styles.myForestContainer}>
            <MyForestContainer userprofile={userprofile} />
          </div>
        )}
      </main>
      {/* <div className={styles.footerDiv}>
        <Footer />
      </div> */}
    </React.Fragment>
  );
}
