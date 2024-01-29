import styles from '../../../app/sites/[slug]/dashboard/DashboardLayout.module.scss';
import NotionLinkIcon from '../../../public/assets/images/icons/Sidebar/NotionLinkIcon';

// TODOO - translations
const PlatformDocsLink = () => {
  return (
    <div className={styles.optionsMenuItemContainer}>
      <a
        href="https://plantfortheplanet.notion.site/Public-Documentation-Plant-for-the-Planet-Platform-04af8ed821b44d358130142778d79e01"
        className={styles.optionsMenuItem}
        target="_blank"
      >
        <NotionLinkIcon />
        <div className={styles.optionsMenuText}>
          Platform Documentation (EN)
        </div>
      </a>
    </div>
  );
};

export default PlatformDocsLink;
