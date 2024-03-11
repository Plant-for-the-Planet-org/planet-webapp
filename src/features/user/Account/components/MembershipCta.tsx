import MuiButton from '../../../common/InputTypes/MuiButton';
import PlanetLogo from '../../../../../public/assets/images/PlanetLogo';
import styles from '../AccountHistory.module.scss';
import { useTranslation, Trans } from 'next-i18next';
import { getDonationUrl } from '../../../../utils/getDonationUrl';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import { useTenant } from '../../../common/Layout/TenantContext';

interface Props {
  placement: 'top' | 'right';
}

const MembershipCta = ({ placement }: Props) => {
  const { t } = useTranslation('me');
  const { token } = useUserProps();
  const { tenantConfig } = useTenant();

  return (
    <a
      className={`${styles.membershipCta} ${
        placement === 'top'
          ? styles.membershipCtaTop
          : styles.membershipCtaRight
      }`}
      href={encodeURI(
        getDonationUrl(tenantConfig.id, 'proj_LOxkf5GYI054Fi0HcEUF3dKu', token)
      )}
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
