import type { SetState } from '../../../../common/types/common';

import { Alert, Snackbar } from '@mui/material';
import { useTranslations } from 'next-intl';
import CustomModal from '../../../../common/Layout/CustomModal';
import styles from '../../StepForm.module.scss';
import AutorenewIcon from '@mui/icons-material/Autorenew';

interface SitesSyncActionsProps {
  isSyncedWithRestoreEco: boolean;
  setIsSyncedWithRestoreEco: SetState<boolean>;
  isSiteSyncModalOpen: boolean;
  setIsSiteSyncModalOpen: SetState<boolean>;
  handleSyncSites: () => Promise<void>;
}

const SitesSyncActions = ({
  isSyncedWithRestoreEco,
  setIsSyncedWithRestoreEco,
  isSiteSyncModalOpen,
  setIsSiteSyncModalOpen,
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
        open={isSyncedWithRestoreEco}
        autoHideDuration={4000}
        onClose={() => setIsSyncedWithRestoreEco(false)}
      >
        <Alert
          elevation={6}
          variant="filled"
          onClose={() => setIsSyncedWithRestoreEco(false)}
          severity="success"
        >
          {tSyncSites('success')}
        </Alert>
      </Snackbar>
      <CustomModal
        modalTitle={tSyncSites('modal.title')}
        modalSubtitle={tSyncSites('modal.subtitle')}
        continueButtonText={tSyncSites('send')}
        cancelButtonText={tSyncSites('cancel')}
        isOpen={isSiteSyncModalOpen}
        handleCancel={() => setIsSiteSyncModalOpen(false)}
        handleContinue={handleSyncSites}
      />
    </>
  );
};

export default SitesSyncActions;
