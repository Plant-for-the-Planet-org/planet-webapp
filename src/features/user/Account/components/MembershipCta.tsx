import MuiButton from '../../../common/InputTypes/MuiButton';
import PlanetLogo from '../../../../../public/assets/images/PlanetLogo';
import styles from '../AccountHistory.module.scss';
import { useTranslations, useLocale } from 'next-intl';
import { clsx } from 'clsx';

interface Props {
  placement: 'top' | 'right';
}

const MembershipCta = ({ placement }: Props) => {
  const t = useTranslations('Me');
  const locale = useLocale();

  return (
    <a
      className={clsx(
        styles.membershipCta,
        placement === 'top' && styles.membershipCtaTop,
        placement === 'right' && styles.membershipCtaRight
      )}
      href={
        locale === 'de'
          ? 'https://www.plant-for-the-planet.org/de/foerdermitgliedschaft/'
          : 'https://www.plant-for-the-planet.org/donor-circle/'
      }
    >
      <div className={styles.overlay}></div>
      <PlanetLogo className={styles.logo} />
      <div className={styles.membershipCtaContent}>
        <p className={styles.membershipCtaCopy}>
          {t.rich('membershipCtaCopy', {
            highlight: (chunks) => (
              <span className={styles.highlighted}>{chunks}</span>
            ),
          })}
        </p>
        <MuiButton variant="contained" component="div">
          {t('membershipCtaButtonText')}
        </MuiButton>
      </div>
    </a>
  );
};

export default MembershipCta;
