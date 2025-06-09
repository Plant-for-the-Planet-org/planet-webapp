import SiteLayerDropdown from './SiteLayerDropdown';
import styles from './SiteMapLayerControls.module.scss';

const SiteLayerSelector = () => {
  return (
    <div className={styles.siteLayerSelector}>
      <SiteLayerDropdown />
      <p className={styles.timePeriodText}>Since project begin 2018</p>
    </div>
  );
};
export default SiteLayerSelector;
