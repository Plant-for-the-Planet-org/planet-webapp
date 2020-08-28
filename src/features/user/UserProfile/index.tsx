import React, { useRef } from 'react';
import LandingSection from '../../common/Layout/LandingSection';
import styles from './UserProfile.module.scss';
import Settings from '../../../assets/images/icons/userProfileIcons/Settings';
import ScrollDown from '../../../assets/images/icons/userProfileIcons/ScrollDown';
import MyForestContainer from './components/MyForestContainer';
import Footer from '../../common/Footer';
import UserInfo from './components/UserInfo';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

import SettingsModal from './components/SettingsModal';

export default function UserProfile({ userprofile }: any) {

  function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const [textCopiedsnackbarOpen, setTextCopiedSnackbarOpen] = React.useState(false);

  const handleTextCopiedSnackbarOpen = () => {
    setTextCopiedSnackbarOpen(true)
  }
  const handleTextCopiedSnackbarClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setTextCopiedSnackbarOpen(false);
  };

  const scrollRef = useRef(null);

  function handleScrollDownClick() {
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


  
  // editProfile modal  (from settings modal)
  const [editProfileModalOpen, setEditProfileModalOpen] = React.useState(false);
  const handleEditProfileModalClose = () => {
    setEditProfileModalOpen(false);
  };
  const handleEditProfileModalOpen = () => {
    setEditProfileModalOpen(true);
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

              editProfileModalOpen = {editProfileModalOpen}
              handleEditProfileModalClose = {handleEditProfileModalClose}
              handleEditProfileModalOpen = {handleEditProfileModalOpen}
            />
          </>
        )}
        {userprofile.isMe && (
          <div className={styles.downIcon} onClick={handleScrollDownClick}>
            <ScrollDown color="white" />
          </div>
        )}

        {/* userinfo section */}
        <LandingSection fixedBg>
          <UserInfo 
          userprofile={userprofile} 
          handleTextCopiedSnackbarOpen={handleTextCopiedSnackbarOpen}
          />
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

        {/* snackbar for showing text copied to clipboard */}
      <Snackbar open={textCopiedsnackbarOpen} autoHideDuration={4000} onClose={handleTextCopiedSnackbarClose} >
      <Alert onClose={handleTextCopiedSnackbarClose} severity="success">
          Text Copied to Clipboard!
        </Alert>
      </Snackbar>

    </React.Fragment>
  );
}
