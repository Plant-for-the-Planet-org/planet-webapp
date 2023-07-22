import { useTranslation } from 'next-i18next';
import { Button } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import {
  SupportSvg,
  ShareSvg,
} from '../../../../../../public/assets/images/ProfilePageIcons';
import myProfilestyle from '../../styles/MyProfile.module.scss';
import { useRouter } from 'next/router';

const FeaturesForPublicAccount = ({ profile }) => {
  const { t } = useTranslation(['me']);
  const router = useRouter();

  const handleSupport = () => {
    router.push(`/s/${profile.slug}`);
  };

  return (
    <div className={myProfilestyle.buttonContainer}>
      {profile?.type !== 'tpo' && (
        <Button
          variant="contained"
          startIcon={<SupportSvg />}
          onClick={handleSupport}
        >
          {t('me:support')}
        </Button>
      )}

      <Button variant="contained" startIcon={<LinkedInIcon />}>
        {t('me:linkedIn')}
      </Button>
      <Button variant="contained" startIcon={<ShareSvg />}>
        {t('me:share')}
      </Button>
    </div>
  );
};

export default FeaturesForPublicAccount;
