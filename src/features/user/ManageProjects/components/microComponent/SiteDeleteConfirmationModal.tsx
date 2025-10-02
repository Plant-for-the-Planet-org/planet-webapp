import type { SetState } from '../../../../common/types/common';
import type { SiteInfo } from '../ProjectSites';

import { CircularProgress, Modal } from '@mui/material';
import WebappButton from '../../../../common/WebappButton';
import styles from '../../StepForm.module.scss';
import { useTranslations } from 'next-intl';

interface SiteDeleteModalProps {
  isModalOpen: boolean;
  setIsModalOpen: SetState<boolean>;
  deleteProjectSite: (siteId: string) => Promise<void>;
  selectedSiteInfo: SiteInfo;
  isUploadingData: boolean;
}

const SiteDeleteConfirmationModal = ({
  isModalOpen,
  setIsModalOpen,
  deleteProjectSite,
  selectedSiteInfo,
  isUploadingData,
}: SiteDeleteModalProps) => {
  const t = useTranslations('ManageProjects');
  return (
    <Modal open={isModalOpen} aria-labelledby="delete-site-title">
      <div className={styles.siteDeleteConfirmationModal}>
        <p className={styles.siteDeleteConfirmationText}>
          {t('siteDeleteConfirmation', {
            siteName: selectedSiteInfo.siteName ?? '',
          })}
        </p>
        {!isUploadingData ? (
          <div className={styles.buttonsContainer}>
            <WebappButton
              text={t('cancel')}
              elementType="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            />
            (
            <WebappButton
              text={t('delete')}
              elementType="button"
              variant="primary"
              onClick={() => {
                if (selectedSiteInfo.siteId !== null) {
                  deleteProjectSite(selectedSiteInfo.siteId);
                }
              }}
            />
            )
          </div>
        ) : (
          <div className={styles.spinnerContainer}>
            <CircularProgress color="success" />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SiteDeleteConfirmationModal;
