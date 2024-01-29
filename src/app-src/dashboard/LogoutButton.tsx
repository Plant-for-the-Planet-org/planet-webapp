import styles from '../../../app/sites/[slug]/dashboard/DashboardLayout.module.scss';
import LogoutIcon from '../../../public/assets/images/icons/Sidebar/LogoutIcon';

// TODOO - logout functionality
const LogoutButton = () => {
  return (
    <div className={styles.optionsMenuItemContainer}>
      <button
        className={styles.optionsMenuItem}
        onClick={() => {
          alert('logout functionality to be implemented');
        }}
      >
        <LogoutIcon />
        <div className={styles.optionsMenuText}>Logout</div>
      </button>
    </div>
  );
};

export default LogoutButton;
