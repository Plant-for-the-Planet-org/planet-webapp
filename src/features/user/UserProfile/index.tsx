import React, { useRef } from 'react';
import LandingSection from '../../common/Layout/LandingSection';
import styles from './UserProfile.module.scss';
import Settings from '../../../assets/images/icons/userProfileIcons/Settings';
import ScrollDown from '../../../assets/images/icons/userProfileIcons/ScrollDown';
import MyForestContainer from './components/MyForestContainer';
import Footer from '../../common/Footer';
import UserInfo from './components/UserInfo';

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

        {/* userinfo section */}
        <LandingSection fixedBg>
          <UserInfo userprofile={userprofile} />
        </LandingSection>

          {/* my forest section */}
          {userprofile.isMe && (
          <div ref={scrollRef} className={styles.myForestContainer}>
            <MyForestContainer userprofile={userprofile} />
          </div>
        )}

        {/* footer */}
        <div className={styles.footerDiv}>
          <Footer />
        </div>
        

        
      </main>
    </React.Fragment>
  );
}
