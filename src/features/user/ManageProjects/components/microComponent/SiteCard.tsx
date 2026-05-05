import type { Site } from '../../../../common/types/project';

import styles from '../../StepForm.module.scss';
import TrashIcon from '../../../../../../public/assets/images/icons/manageProjects/Trash';
import EditIcon from '../../../../../../public/assets/images/icons/manageProjects/Pencil';
import { useTranslations } from 'next-intl';
import SitePreviewMap from './SitePreviewMap';

interface StatusOption {
  label: string;
  value: string;
}

interface SiteCardProps {
  site: Site;
  statusOptions: StatusOption[];
  iconColor: string;
  onDeleteClick: (siteId: string, siteName: string) => void;
  onEditClick: (site: Site) => void;
}

const SiteCard = ({ site, statusOptions, iconColor, onDeleteClick, onEditClick }: SiteCardProps) => {
  const t = useTranslations('ManageProjects');
  const statusLabel = statusOptions.find((e) => site.status === e.value)?.label.toUpperCase();

  return (
    <div>
      <div className={styles.mapboxContainer}>
        <div className={styles.uploadedMapName}>{site.name}</div>
        <div className={styles.uploadedMapStatus}>{statusLabel}</div>
        <div className={styles.siteActions}>
          <button
            type="button"
            aria-label={t('deleteSite')}
            onClick={() => onDeleteClick(site.id, site.name)}
            className={styles.controlButton}
          >
            <TrashIcon />
          </button>
          <button
            type="button"
            aria-label={t('editSite')}
            onClick={() => onEditClick(site)}
            className={styles.controlButton}
          >
            <EditIcon color={iconColor} />
          </button>
        </div>
        <SitePreviewMap siteId={site.id} siteGeometry={site.geometry} />
      </div>
    </div>
  );
};

export default SiteCard;
