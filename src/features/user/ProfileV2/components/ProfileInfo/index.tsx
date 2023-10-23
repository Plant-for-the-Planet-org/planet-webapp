import { useState, ReactElement } from 'react';
import ProfileMainContainer from '../ProfileMainContainer';
import { useTranslation } from 'next-i18next';
import tenantConfig from '../../../../../../tenant.config';
import UserInfo from '../MicroComponents/UserInfo';
import { ProfileProps } from '../../../../common/types/profile';
import UserFeatures from '../userFeatures/UserFeatures';

const config = tenantConfig();

const Profile = ({ userProfile }: ProfileProps): ReactElement => {
  const { t, ready } = useTranslation(['donate']);
  const [showSocialButton, setShowSocialButton] = useState(false);

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
