import type {
  CategoryLegendData,
  LegendData,
  RangeLegendData,
} from '../../../../../utils/mapsV2/mapSettings.config';

import { useTranslations } from 'next-intl';
import styles from '../MapFeatureExplorer.module.scss';

interface RangeLegendProps {
  legend: RangeLegendData;
}

interface CategoryLegendProps {
  legend: CategoryLegendData;
}

interface LayerLegendProps {
  legend: LegendData;
}

const RangeLegend = ({ legend }: RangeLegendProps) => {
  return (
    <div className={styles.layerLegend}>
      <div
        className={styles.legendBar}
        style={{ background: legend.gradient }}
      ></div>
      <div className={styles.legendValues}>
        <div>{legend.min}</div>
        <div>
          {legend.max}
          {legend.unit ? ` ${legend.unit}` : ''}
        </div>
      </div>
    </div>
  );
};

const CategoryLegend = ({ legend }: CategoryLegendProps) => {
  const tLegends = useTranslations('Maps.exploreLayers.legends');

  const firstCategory = legend.categories[0].categoryKey;
  const lastCategory =
    legend.categories[legend.categories.length - 1].categoryKey;

  return (
    <div className={styles.layerLegend}>
      <div className={`${styles.legendBar} ${styles.legendBarCategory}`}>
        {legend.categories.map((category) => {
          return (
            <div
              key={category.categoryKey}
              className={styles.legendCategoryColor}
              style={{ background: category.color }}
            ></div>
          );
        })}
      </div>
      <div className={styles.legendValues}>
        <div>{tLegends(firstCategory)}</div>
        <div>{tLegends(lastCategory)}</div>
      </div>
    </div>
  );
};

const LayerLegend = ({ legend }: LayerLegendProps) => {
  if (legend.type === 'range') return <RangeLegend legend={legend} />;
  else return <CategoryLegend legend={legend} />;
};

export default LayerLegend;
