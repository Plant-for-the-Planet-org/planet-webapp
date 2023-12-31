import { Button } from '@mui/material';
import { SupportSvg } from '../../../../../../public/assets/images/ProfilePageIcons';
import theme from '../../../../../theme/themeProperties';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { User } from '@planet-sdk/common';

interface NormalUserPublicProfileFeatureProps {
  profile: User | null;
}

const NormalUserPublicProfileFeature = ({
  profile,
}: NormalUserPublicProfileFeatureProps) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { light } = theme;
  const handleSupport = () => {
    router.push(`/s/${profile?.slug}`);
  };
  return (
    <>
      <Button
        variant="contained"
        startIcon={<SupportSvg color={`${light.light}`} />}
        onClick={handleSupport}
      >
        {t('me:support')}
      </Button>
    </>
  );
};

export default NormalUserPublicProfileFeature;
