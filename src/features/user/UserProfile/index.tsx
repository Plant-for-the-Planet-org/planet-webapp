import React, { useRef } from 'react';
import LandingSection from '../../common/Layout/LandingSection';
import styles from './UserProfile.module.scss';
import Settings from '../../../assets/images/icons/userProfileIcons/Settings';
import ScrollDown from '../../../assets/images/icons/userProfileIcons/ScrollDown';
import MyForestContainer from './components/MyForestContainer';
import Footer from '../../common/Footer';
import UserInfo from './components/UserInfo';

import SettingsModal from './components/SettingsModal';

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

  // settings modal
  const [settingsModalOpen, setSettingsModalOpen] = React.useState(false);
  const handleSettingsModalClose = () => {
    setSettingsModalOpen(false);
  };
  const handleSettingsModalOpen = () => {
    setSettingsModalOpen(true);
  };

   

  return (
    <React.Fragment>
      <main>
        {/* will render only if it is ME page */}
        {userprofile.isMe && (
          <>
            <div
              className={styles.settingsIcon}
              onClick={handleSettingsModalOpen}
            >
              <Settings color="white" />
            </div>
            <SettingsModal
              settingsModalOpen={settingsModalOpen}
              handleSettingsModalClose={handleSettingsModalClose}
            />
          </>
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
