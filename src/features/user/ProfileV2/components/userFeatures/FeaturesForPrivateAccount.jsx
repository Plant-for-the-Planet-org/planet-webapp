import { Button } from '@mui/material';
import {
  RedeemCodeSvg,
  RegisteredTreeSvg,
  ShareSvg,
} from '../../../../../../public/assets/images/ProfilePageIcons';
import { useRouter } from 'next/router';
import RedeemModal from '../../../Profile/components/RedeemModal';
import myProfilestyle from '../../styles/MyProfile.module.scss';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';

const FeaturesForPrivateAccount = () => {
  const { t } = useTranslation(['me']);
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
  const router = useRouter();
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
    <>
      <div className={myProfilestyle.buttonContainer}>
        <Button
          variant="contained"
          startIcon={<RedeemCodeSvg />}
          onClick={handleRedeemModalOPen}
        >
          {t('redeem:redeem')}
        </Button>
        <RedeemModal
          redeemModalOpen={isRedeemModalOpen}
          handleRedeemModalClose={handleRedeemModalClose}
        />
        <Button
          variant="contained"
          startIcon={<RegisteredTreeSvg />}
          onClick={handleRegisterTree}
        >
          {t('me:registerTrees')}
        </Button>
        <Button variant="contained" startIcon={<ShareSvg />}>
          {t('me:share')}
        </Button>
      </div>
    </>
  );
};

export default FeaturesForPrivateAccount;
