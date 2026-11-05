import { useLocale, useTranslations } from 'next-intl';
import LogoutIcon from '../../../../../public/assets/images/icons/Sidebar/LogoutIcon';
import styles from './ImpersonateUser.module.scss';
import useLocalizedPath from '../../../../hooks/useLocalizedPath';
import { useRouter } from 'next/router';
import { useAuthStore, useTenantStore, useUserStore } from '../../../../stores';

const ImpersonationActivated = () => {
  const t = useTranslations('Me');
  const locale = useLocale();
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  // store: state
  const token = useAuthStore((state) => state.token);
  const isImpersonationModeOn = useUserStore(
    (state) => state.isImpersonationModeOn
  );
  const tenantId = useTenantStore((state) => state.tenantConfig.id);
  // store: action
  const fetchUserProfile = useUserStore((state) => state.fetchUserProfile);
  const impersonatedUserEmail = useUserStore(
    (state) => state.userProfile?.email
  );
  const exitImpersonation = useUserStore((state) => state.exitImpersonation);

  const handleExitImpersonation = () => {
    // Exiting impersonation just clears local state, so always do it. Restoring
    // the real profile needs a token, and the target route is protected, so
    // gate the navigation and refetch on the token.
    exitImpersonation();
    if (token) {
      router.push(localizedPath(`/profile/impersonate-user`));
      fetchUserProfile({
        token,
        tenantId,
        locale,
      }).catch((error) => {
        // Errors are surfaced through the global `profileApiError` flow.
        console.error(
          '[Profile API] Failed to restore the real user profile:',
          error
        );
      });
    }
  };

  return impersonatedUserEmail && isImpersonationModeOn ? (
    <div className={styles.impersonationAlertContainer}>
      <div>
        {t('targetUser', { impersonatedEmail: `<${impersonatedUserEmail}>` })}
      </div>

      <button
        type="button"
        onClick={handleExitImpersonation}
        className={styles.exitImpersonationContainer}
      >
        <div>
          <LogoutIcon />
        </div>
        <div className={styles.exit}>{t('exitImpersonation')}</div>
      </button>
    </div>
  ) : null;
};

export default ImpersonationActivated;
