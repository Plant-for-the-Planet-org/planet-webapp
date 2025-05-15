import styles from './SiteMapLayerControls.module.scss';
import SiteLayerDropdown from './SiteLayerDropdown';

const SiteLayerSelector = () => {
  return (
    <div className={styles.siteLayerSelector}>
      <SiteLayerDropdown />
      <p className={styles.timePeriodText}>Since project begin 2018</p>
    </div>
  );
};
export default SiteLayerSelector;
