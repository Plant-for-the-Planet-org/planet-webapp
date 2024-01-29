import FiberPinIcon from '@mui/icons-material/FiberPin';
import styles from '../../../app/sites/[slug]/dashboard/DashboardLayout.module.scss';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Tooltip from '@mui/material/Tooltip';

// TODOO - data, refresh support Pin
const SupportPin = () => {
  return (
    <div className={`${styles.optionsMenuItemContainer}`}>
      <div className={styles.optionsMenuItem}>
        <FiberPinIcon />
        <div className={styles.optionsMenuText}>
          Support Pin: <span className={styles.supportPin}>3434</span>
        </div>
        <Tooltip title="Reset Pin" arrow={true}>
          <button
            onClick={() => {
              alert('Reset functionality to be inplemented');
            }}
            className={styles.refreshPinButton}
          >
            <RestartAltIcon />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default SupportPin;
