import { useState, ReactElement } from 'react';
import ProfileContainer from './styles/ProfileContainer';
import { useTranslation } from 'next-i18next';
import tenantConfig from '../../../../tenant.config';
import FeaturesForPrivateAccount from './components/userFeatures/FeaturesForPrivateAccount';
import FeaturesForPublicAccount from './components/userFeatures/FeaturesForPublicAccount';
import UserInfo from './components/MicroComponents/UserInfo';
import { ProfileProps } from '../../common/types/profile';
import { useRouter } from 'next/router';

const config = tenantConfig();

const Profile = ({ userProfile }: ProfileProps): ReactElement => {
  const { t, ready } = useTranslation(['donate']);
  const [showSocialButton, setShowSocialButton] = useState(false);
  const router = useRouter();
  const handleShare = () => {
    if (navigator?.share) {
      navigator
        ?.share({
          title: ready ? t('donate:shareTextTitle') : '',
          url: `${process.env.SCHEME}://${config.tenantURL}/t/${userProfile.slug}`,
          text: ready
            ? t('donate:textToShare', { name: userProfile.displayName })
            : '',
        })
        .then(() => {
          console.log('thanks for sharing');
        })
        .catch(() => {
          console.log('error in sharing');
        });
    } else {
      setShowSocialButton(!showSocialButton);
    }
  };

  return (
    <ProfileContainer>
      <UserInfo userProfile={userProfile} />

      {!userProfile?.isPrivate && router.asPath !== '/profile' ? (
        <FeaturesForPublicAccount
          handleShare={handleShare}
          userprofile={userProfile}
          showSocialButton={showSocialButton}
          setShowSocialButton={setShowSocialButton}
        />
      ) : (
        <FeaturesForPrivateAccount
          handleShare={handleShare}
          userprofile={userProfile}
          showSocialButton={showSocialButton}
          setShowSocialButton={setShowSocialButton}
        />
      )}
    </ProfileContainer>
  );
};

export default Profile;
