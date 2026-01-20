import { useLocale, useTranslations } from 'next-intl';
import LogoutIcon from '../../../../../public/assets/images/icons/Sidebar/LogoutIcon';
import styles from './ImpersonateUser.module.scss';
import useLocalizedPath from '../../../../hooks/useLocalizedPath';
import { useRouter } from 'next/router';
import { useAuthStore, useUserStore } from '../../../../stores';
import { useTenant } from '../../../common/Layout/TenantContext';

const ImpersonationActivated = () => {
  const t = useTranslations('Me');
  const locale = useLocale();
  const { tenantConfig } = useTenant();
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  // store: state
  const token = useAuthStore((state) => state.token);
  const isImpersonationModeOn = useUserStore(
    (state) => state.isImpersonationModeOn
  );
  // store: action
  const fetchUserProfile = useUserStore((state) => state.fetchUserProfile);
  const impersonatedUserEmail = useUserStore(
    (state) => state.userProfile?.email
  );
  const setIsImpersonationModeOn = useUserStore(
    (state) => state.setIsImpersonationModeOn
  );

  const exitImpersonation = () => {
    setIsImpersonationModeOn(false);
    localStorage.removeItem('impersonationData');
    router.push(localizedPath(`/profile/impersonate-user`));
    fetchUserProfile({
      token,
      tenantConfigId: tenantConfig.id,
      locale,
    });
  };

  return impersonatedUserEmail && isImpersonationModeOn ? (
    <div className={styles.impersonationAlertContainer}>
      <div>
        {t('targetUser', { impersonatedEmail: `<${impersonatedUserEmail}>` })}
      </div>

      <div
        onClick={exitImpersonation}
        className={styles.exitImpersonationContainer}
      >
        <div>
          <LogoutIcon />
        </div>
        <div className={styles.exit}>{t('exitImpersonation')}</div>
      </div>
    </div>
  ) : null;
};

export default ImpersonationActivated;
