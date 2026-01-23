import type { SetState } from '../../../../common/types/common';

import { Alert, Snackbar } from '@mui/material';
import { useTranslations } from 'next-intl';
import CustomModal from '../../../../common/Layout/CustomModal';
import SitesSyncModalContent from './SitesSyncModalContent';
import styles from '../../StepForm.module.scss';
import AutorenewIcon from '@mui/icons-material/Autorenew';

interface SitesSyncActionsProps {
  isSyncingSites: boolean;
  isSiteSyncSuccessful: boolean;
  snackbarOpen: boolean;
  setSnackbarOpen: SetState<boolean>;
  isSiteSyncModalOpen: boolean;
  setIsSiteSyncModalOpen: SetState<boolean>;
  handleSyncSites: () => Promise<void>;
}

const SitesSyncActions = ({
  isSyncingSites,
  isSiteSyncSuccessful,
  isSiteSyncModalOpen,
  setIsSiteSyncModalOpen,
  snackbarOpen,
  setSnackbarOpen,
  handleSyncSites,
}: SitesSyncActionsProps) => {
  const tSyncSites = useTranslations('ManageProjects.syncSites');
  return (
    <>
      {!isSiteSyncSuccessful && (
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
        modalSubtitle={<SitesSyncModalContent />}
        continueButtonText={tSyncSites('send')}
        cancelButtonText={tSyncSites('cancel')}
        isOpen={isSiteSyncModalOpen}
        isLoading={isSyncingSites}
        loadingText={tSyncSites('syncing')}
        handleCancel={() => setIsSiteSyncModalOpen(false)}
        handleContinue={handleSyncSites}
      />
    </>
  );
};

export default SitesSyncActions;
