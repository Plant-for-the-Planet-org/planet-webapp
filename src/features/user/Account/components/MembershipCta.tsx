import MuiButton from '../../../common/InputTypes/MuiButton';
import PlanetLogo from '../../../../../public/assets/images/PlanetLogo';
import styles from '../AccountHistory.module.scss';
import { useTranslations } from 'next-intl';
import { getDonationUrl } from '../../../../utils/getDonationUrl';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import { useTenant } from '../../../common/Layout/TenantContext';

interface Props {
  placement: 'top' | 'right';
}

const MembershipCta = ({ placement }: Props) => {
  const t = useTranslations('Me');
  const { token } = useUserProps();
  const { tenantConfig } = useTenant();

  return (
    <a
      className={`${styles.membershipCta} ${
        placement === 'top'
          ? styles.membershipCtaTop
          : styles.membershipCtaRight
      }`}
      href={getDonationUrl(
        tenantConfig.id,
        'proj_LOxkf5GYI054Fi0HcEUF3dKu',
        token
      )}
    >
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
