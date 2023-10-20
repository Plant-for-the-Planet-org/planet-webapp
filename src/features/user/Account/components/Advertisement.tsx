import MuiButton from '../../../common/InputTypes/MuiButton';
import PlanetLogo from '../../../../../public/assets/images/PlanetLogo';
import styles from '../AccountHistory.module.scss';
import { useTranslation, Trans } from 'next-i18next';

interface Props {
  placement: 'top' | 'right';
}

const Advertisement = ({ placement }: Props) => {
  const { t } = useTranslation('me');
  return (
    <a
      className={`${styles.ad} ${
        placement === 'top' ? styles.adTop : styles.adRight
      }`}
      href="https://donate.plant-for-the-planet.org/?to=proj_LOxkf5GYI054Fi0HcEUF3dKu&callback_url=https%3A%2F%2Fwww1.plant-for-the-planet.org%2Fprofile"
    >
      <PlanetLogo className={styles.logo} />
      <div className={styles.adContent}>
        <p className={styles.adCopy}>
          <Trans i18nKey="me:adCopy">
            Support us{' '}
            <span className={styles.highlighted}>by becoming a member</span>
          </Trans>
        </p>
        <MuiButton variant="contained" component="div">
          {t('me:adButtonText')}
        </MuiButton>
      </div>
    </a>
  );
};

export default Advertisement;
