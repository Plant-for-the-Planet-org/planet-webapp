import { useState, ReactElement } from 'react';
import ProfileMainContainer from './microComponents/ProfileMainContainer';
import { useTranslations } from 'next-intl';
import UserInfo from './microComponents/UserInfo';
import { ProfileProps } from '../../../../common/types/profile';
import UserFeatures from './microComponents/UserFeatures';
import { useTenant } from '../../../../common/Layout/TenantContext';

const Profile = ({ userProfile }: ProfileProps): ReactElement => {
  const { tenantConfig } = useTenant();
  const t = useTranslations('Donate');
  const [showSocialButton, setShowSocialButton] = useState(false);

  const handleShare = () => {
    if (navigator?.share) {
      navigator
        ?.share({
          title: t('shareTextTitle'),
          url: `${process.env.SCHEME}://${tenantConfig.config.tenantURL}/t/${userProfile.slug}`,
          text: t('textToShare', { name: userProfile.displayName }),
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
  const userFeatureProps = {
    handleShare,
    userProfile,
    showSocialButton,
    setShowSocialButton,
  };

  return (
    <ProfileMainContainer>
      <UserInfo userProfile={userProfile} />
      <UserFeatures {...userFeatureProps} />
    </ProfileMainContainer>
  );
};

export default Profile;
