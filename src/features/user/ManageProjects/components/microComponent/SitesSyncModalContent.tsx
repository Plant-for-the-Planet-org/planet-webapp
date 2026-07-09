import { useTranslations } from 'next-intl';
import styles from '../../StepForm.module.scss';

const SitesSyncModalContent = () => {
  const tSyncSites = useTranslations('ManageProjects.syncSites');

  return (
    <div className={styles.siteSyncModalContent}>
      <div className={styles.terms}>
        {tSyncSites.rich('modal.terms', {
          highlightedAction: (chunks) => <strong>{chunks}</strong>,
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
      </div>
      <div className={styles.requirements}>
        <strong>{tSyncSites('modal.requirements.title')}</strong>
        <ul>
          <li>
            {tSyncSites.rich('modal.requirements.activeAccount', {
              bold: (chunks) => <strong>{chunks}</strong>,
            })}
          </li>
          <li>
            {tSyncSites.rich('modal.requirements.consultation', {
              bold: (chunks) => <strong>{chunks}</strong>,
            })}
          </li>
        </ul>
      </div>
      {process.env.NEXT_PUBLIC_HELP_EMAIL_RESTOR !== undefined && (
        <div className={styles.helpText}>
          {tSyncSites.rich('modal.helpText', {
            email: process.env.NEXT_PUBLIC_HELP_EMAIL_RESTOR,
            emailLink: (chunks) => (
              <a
                href={`mailto:${process.env.NEXT_PUBLIC_HELP_EMAIL_RESTOR}`}
                className={styles.restorLink}
              >
                {chunks}
              </a>
            ),
          })}
        </div>
      )}
    </div>
  );
};

export default SitesSyncModalContent;
