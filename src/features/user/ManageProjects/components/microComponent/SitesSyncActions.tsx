import type { SetState } from '../../../../common/types/common';

import { Alert, Snackbar } from '@mui/material';
import { useTranslations } from 'next-intl';
import CustomModal from '../../../../common/Layout/CustomModal';
import styles from '../../StepForm.module.scss';
import AutorenewIcon from '@mui/icons-material/Autorenew';

interface SitesSyncActionsProps {
  isSyncingSites: boolean;
  isSyncedWithRestoreEco: boolean;
  snackbarOpen: boolean;
  setSnackbarOpen: SetState<boolean>;
  isSiteSyncModalOpen: boolean;
  setIsSiteSyncModalOpen: SetState<boolean>;
  handleSyncSites: () => Promise<void>;
}

const SitesSyncActions = ({
  isSyncingSites,
  isSyncedWithRestoreEco,
  isSiteSyncModalOpen,
  setIsSiteSyncModalOpen,
  snackbarOpen,
  setSnackbarOpen,
  handleSyncSites,
}: SitesSyncActionsProps) => {
  const tSyncSites = useTranslations('ManageProjects.syncSites');
  return (
    <>
      {!isSyncedWithRestoreEco && (
        <button
          className={styles.inlineLinkButton}
          type="button"
          onClick={() => setIsSiteSyncModalOpen(true)}
        >
          <AutorenewIcon />
          {tSyncSites('syncSitesToRestorEco')}
        </button>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          elevation={6}
          variant="filled"
          severity="success"
          onClose={() => setSnackbarOpen(false)}
        >
          {tSyncSites('success')}
        </Alert>
      </Snackbar>
      <CustomModal
        modalTitle={tSyncSites('modal.title')}
        modalSubtitle={tSyncSites.rich('modal.subtitle', {
          restorLink: (chunks) => (
            <a
              href="https://restor.eco"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.restorLink}
            >
              {chunks}
            </a>
          ),
          privacyPolicyLink: (chunks) => (
            <a
              href="https://restor.eco/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.restorLink}
            >
              {chunks}
            </a>
          ),
        })}
        continueButtonText={tSyncSites('send')}
        cancelButtonText={tSyncSites('cancel')}
        isOpen={isSiteSyncModalOpen}
        isLoading={isSyncingSites}
        loadingText={tSyncSites('loading')}
        handleCancel={() => setIsSiteSyncModalOpen(false)}
        handleContinue={handleSyncSites}
      />
    </>
  );
};

export default SitesSyncActions;
