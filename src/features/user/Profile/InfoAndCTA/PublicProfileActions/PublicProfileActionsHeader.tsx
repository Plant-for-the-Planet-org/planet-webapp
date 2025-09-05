import styles from '../InfoAndCta.module.scss';
import WebappButton from '../../../../common/WebappButton';
import { useTranslations } from 'next-intl';

const PublicProfileActionsHeader = () => {
  const t = useTranslations('Profile');
  return (
    <div className={styles.publicProfileActionsHeader}>
      <h2 className={styles.headerTitle}>
        {t('infoAndCtaContainer.pfpDonorCircleMember')}
      </h2>
      <WebappButton
        variant="tertiary"
        href="https://www.plant-for-the-planet.org/donor-circle/"
        elementType="link"
        target="_blank"
        text={t('infoAndCtaContainer.publicProfileActions.becomeAMember')}
      />
    </div>
  );
};

export default PublicProfileActionsHeader;
