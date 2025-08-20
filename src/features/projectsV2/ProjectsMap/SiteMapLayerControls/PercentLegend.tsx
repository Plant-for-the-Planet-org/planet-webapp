import type { PercentLegendData } from '../../../../utils/mapsV2/siteLayerOptions';

import styles from './SiteMapLayerControls.module.scss';

interface PercentLegendProps {
  legend: PercentLegendData;
}

const PercentLegend = ({ legend }: PercentLegendProps) => {
  const legendTitle = 'Range: 0% to 100%';

  return (
    <div className={styles.siteLayerLegend}>
      <div
        className={styles.legendBarContainer}
        title={legendTitle}
        aria-label={legendTitle}
      >
        <div
          className={styles.legendBar}
          style={{ background: legend.gradient }}
        ></div>
      </div>
      <div className={styles.legendValues}>
        <div>0%</div>
        <div>100%</div>
      </div>
    </div>
  );
};

export default PercentLegend;
