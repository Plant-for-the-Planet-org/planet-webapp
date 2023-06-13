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
import myProfilestyle from '../ProfileV2/styles/MyProfile.module.scss';
import { useRouter } from 'next/router';
import { useState } from 'react';
import RedeemModal from '../Profile/components/RedeemModal';

const Profile = ({ userProfile, authenticatedType }) => {
  const { t } = useTranslation(['editProfile', 'redeem', 'me']);
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
  const router = useRouter();

  const handleEditProfile = () => {
    router.push('profile/edit');
  };

  const handleRegisterTree = () => {
    router.push('profile/register-trees');
  };

  const handleRedeemModalOPen = () => {
    setIsRedeemModalOpen(true);
  };

  const handleRedeemModalClose = () => {
    setIsRedeemModalOpen(false);
  };

  return (
    <ProfileContainer>
      <div className={myProfilestyle.userInfoContainer}>
        <Avatar
          alt="user Image"
          src={getImageUrl('profile', 'avatar', userProfile?.image)}
          sx={{ width: 65, height: 65 }}
        />

        <div>
          <div className={myProfilestyle.userInfo}>
            {userProfile?.displayName}
          </div>
          <div>{t('editProfile:member', { date: 'May 2012' })}</div>
        </div>
      </div>
      <div className={myProfilestyle.iconContainer} onClick={handleEditProfile}>
        <EditIcon className={myProfilestyle.icon} />
      </div>

      <div className={myProfilestyle.userDescription}>
        {userProfile?.bio && userProfile?.bio}
      </div>
      <RedeemModal
        redeemModalOpen={isRedeemModalOpen}
        handleRedeemModalClose={handleRedeemModalClose}
      />
      <div className={myProfilestyle.buttonContainer}>
        <Button
          variant="contained"
          startIcon={
            authenticatedType === 'private' ? <RedeemCodeSvg /> : <SupportSvg />
          }
          onClick={authenticatedType === 'private' && handleRedeemModalOPen}
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
