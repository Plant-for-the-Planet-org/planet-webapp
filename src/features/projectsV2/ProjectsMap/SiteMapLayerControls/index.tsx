import SiteLayerLegend from './SiteLayerLegend';
import SiteLayerControlsSection from './SiteLayerSelector';
import styles from './SiteMapLayerControls.module.scss';

const SiteMapLayerControls = () => {
  return (
    <div className={styles.siteMapLayerControls}>
      <SiteLayerControlsSection />
      <SiteLayerLegend />
    </div>
  );
};

export default SiteMapLayerControls;
