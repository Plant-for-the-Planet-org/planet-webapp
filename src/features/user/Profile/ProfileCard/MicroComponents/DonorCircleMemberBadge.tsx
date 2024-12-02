import { useTranslations } from 'next-intl';
import { TreesPlantedIcon } from '../../../../../../public/assets/images/icons/ProgressBarIcons';
import styles from '../ProfileCard.module.scss';

const DonorCircleMemberBadge = () => {
  const t = useTranslations('Profile');
  return (
    <div className={styles.donorCircleMemberBadge}>
      <TreesPlantedIcon width={15} />
      <span role="status">{t('myProfile.donorCircleMember')}</span>
    </div>
  );
};

export default DonorCircleMemberBadge;
