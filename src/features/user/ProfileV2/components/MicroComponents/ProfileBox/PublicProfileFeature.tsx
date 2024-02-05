import { Button } from '@mui/material';
import myProfileStyle from '../../../styles/MyProfile.module.scss';
import { SupportSvg } from '../../../../../../../public/assets/images/ProfilePageIcons';
import theme from '../../../../../../theme/themeProperties';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { User } from '@planet-sdk/common';
import LinkIcon from '@mui/icons-material/Link';

interface NormalUserPublicProfileFeatureProps {
  profile: User | null;
}

export const PublicProfileFeature = ({
  profile,
}: NormalUserPublicProfileFeatureProps) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { light } = theme;
  const handleSupport = (): void => {
    router.push(`/s/${profile?.slug}`);
  };

  const handleShareUrl = () => {
    const profileURL = profile?.url
      ? profile.url.includes('http') || profile.url.includes('https')
        ? profile.url
        : `http://${profile.url}`
      : '';
    if (profileURL) window.open(profileURL, '_blank');
  };
  return (
    <>
      {profile?.type !== 'tpo' && (
        <Button
          className={myProfileStyle.supportButton}
          variant="contained"
          startIcon={<SupportSvg color={`${light.light}`} />}
          onClick={handleSupport}
        >
          {t('me:support')}
        </Button>
      )}

      {profile?.url && (
        <Button
          className={myProfileStyle.linkButton}
          variant="contained"
          onClick={handleShareUrl}
          startIcon={<LinkIcon />}
        >
          {t('me:link')}
        </Button>
      )}
    </>
  );
};
