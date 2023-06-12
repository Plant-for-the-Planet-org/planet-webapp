import { Avatar, Button } from '@mui/material';
import ProfileContainer from './styles/ProfileContainer';
import { useTranslation } from 'next-i18next';
import EditIcon from '@mui/icons-material/Edit';
import {
  RedeemCodeSvg,
  RegisteredTreeSvg,
  ShareSvg,
  SupportSvg,
} from '../../../../public/assets/images/ProfilePageIcons';
import Linkedin from '../../../../public/assets/images/icons/share/Linkedin';
import getImageUrl from '../../../utils/getImageURL';
import styles from '../ProfileV2/styles/MyProfile.module.scss';
import { useRouter } from 'next/router';

const Profile = ({ userProfile, authenticatedType }) => {
  const { t } = useTranslation(['editProfile', 'redeem', 'me']);
  const router = useRouter();

  const handleEditProfile = () => {
    router.push('profile/edit');
  };

  const handleRegisterTree = () => {
    router.push('profile/register-trees');
  };

  return (
    <ProfileContainer>
      <Avatar
        alt="user Image"
        src={getImageUrl('profile', 'avatar', userProfile?.image)}
        sx={{ width: 65, height: 65 }}
      />
      <div className={styles.iconContainer} onClick={handleEditProfile}>
        <EditIcon className={styles.icon} />
      </div>
      <div className={styles.userInfoContainer}>
        <div className={styles.userInfo}>{userProfile?.displayName}</div>
        <div>{t('editProfile:member', { date: 'May 2012' })}</div>
      </div>

      {userProfile?.bio && (
        <div className={styles.userDescription}>{userProfile?.bio}</div>
      )}

      <div className={styles.buttonContainer}>
        <Button
          variant="contained"
          startIcon={
            authenticatedType === 'private' ? <RedeemCodeSvg /> : <SupportSvg />
          }
        >
          {authenticatedType === 'private'
            ? t('redeem:redeem')
            : t('me:support')}
        </Button>
        <Button
          variant="contained"
          startIcon={
            authenticatedType === 'private' ? (
              <RegisteredTreeSvg />
            ) : (
              <Linkedin />
            )
          }
          onClick={authenticatedType === 'private' && handleRegisterTree}
        >
          {authenticatedType === 'private'
            ? t('me:registerTrees')
            : t('me:linkedIn')}
        </Button>
        <Button variant="contained" startIcon={<ShareSvg />}>
          {t('me:share')}
        </Button>
      </div>
    </ProfileContainer>
  );
};

export default Profile;
