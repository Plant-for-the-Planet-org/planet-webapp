import MuiButton from '../../../common/InputTypes/MuiButton';
import PlanetLogo from '../../../../../public/assets/images/PlanetLogo';
import styles from '../AccountHistory.module.scss';
import { useTranslation, Trans } from 'next-i18next';

interface Props {
  placement: 'top' | 'right';
}

const MembershipCta = ({ placement }: Props) => {
  const { t } = useTranslation('me');
  return (
    <a
      className={`${styles.membershipCta} ${
        placement === 'top'
          ? styles.membershipCtaTop
          : styles.membershipCtaRight
      }`}
      href="https://donate.plant-for-the-planet.org/?to=proj_LOxkf5GYI054Fi0HcEUF3dKu&callback_url=https%3A%2F%2Fwww1.plant-for-the-planet.org%2Fprofile"
    >
      <PlanetLogo className={styles.logo} />
      <div className={styles.membershipCtaContent}>
        <p className={styles.membershipCtaCopy}>
          <Trans i18nKey="me:membershipCtaCopy">
            Support us{' '}
            <span className={styles.highlighted}>by becoming a member</span>
          </Trans>
        </p>
        <MuiButton variant="contained" component="div">
          {t('me:membershipCtaButtonText')}
        </MuiButton>
      </div>
    </a>
  );
};

export default MembershipCta;
